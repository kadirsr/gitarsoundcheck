import { useCallback, useEffect, useRef, useState } from "react";
import { calculateNoteActivity } from "../lib/audio/noteActivity";
import { createPitchFrame } from "../lib/audio/pitchDetection";
import type {
  AudioDiagnostics,
  AudioInputDevice,
  PitchFrame,
  PitchTarget
} from "../types";

type AudioStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "blocked"
  | "insecure"
  | "unavailable"
  | "error";

const ANALYSIS_GAIN = 10;
const SIGNAL_PEAK_FLOOR = 0.00001;

function createIdleDiagnostics(): AudioDiagnostics {
  return {
    contextState: "none",
    deviceLabel: "",
    inputDeviceCount: 0,
    lastError: null,
    signalState: "idle",
    silentFrameCount: 0,
    trackMuted: false,
    trackReadyState: "none"
  };
}

export function useAudioPitch(
  minRms: number,
  target: PitchTarget | null = null,
  selectedDeviceId = ""
) {
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [frame, setFrame] = useState<PitchFrame | null>(null);
  const [inputDevices, setInputDevices] = useState<AudioInputDevice[]>([]);
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostics>(createIdleDiagnostics);
  const contextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const inputDevicesRef = useRef<AudioInputDevice[]>([]);
  const lastDiagnosticsUpdateRef = useRef(0);
  const minRmsRef = useRef(minRms);
  const noiseFloorPeakRef = useRef(0);
  const noiseFloorRmsRef = useRef(0);
  const noteActiveRef = useRef(false);
  const selectedDeviceIdRef = useRef(selectedDeviceId);
  const silentFrameCountRef = useRef(0);
  const targetRef = useRef<PitchTarget | null>(target);

  useEffect(() => {
    minRmsRef.current = minRms;
  }, [minRms]);

  useEffect(() => {
    selectedDeviceIdRef.current = selectedDeviceId;
  }, [selectedDeviceId]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const refreshInputDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setInputDevices([]);
      inputDevicesRef.current = [];
      return [];
    }

    const devices = (await navigator.mediaDevices.enumerateDevices())
      .filter((device) => device.kind === "audioinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Mikrofon ${index + 1}`
      }));

    setInputDevices(devices);
    inputDevicesRef.current = devices;
    setDiagnostics((current) => ({
      ...current,
      inputDeviceCount: devices.length
    }));
    return devices;
  }, []);

  useEffect(() => {
    void refreshInputDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshInputDevices);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshInputDevices);
    };
  }, [refreshInputDevices]);

  const closeAudioGraph = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void contextRef.current?.close();
    contextRef.current = null;
    analyserRef.current = null;
    noiseFloorPeakRef.current = 0;
    noiseFloorRmsRef.current = 0;
    noteActiveRef.current = false;
    silentFrameCountRef.current = 0;
  }, []);

  const stop = useCallback(() => {
    closeAudioGraph();
    setFrame(null);
    setStatus("idle");
    setDiagnostics((current) => ({
      ...createIdleDiagnostics(),
      inputDeviceCount: current.inputDeviceCount
    }));
  }, [closeAudioGraph]);

  const start = useCallback(async () => {
    try {
      closeAudioGraph();
      setFrame(null);
      setStatus("requesting");
      setDiagnostics((current) => ({
        ...current,
        contextState: "none",
        lastError: null,
        signalState: "starting",
        silentFrameCount: 0,
        trackMuted: false,
        trackReadyState: "none"
      }));

      if (!window.isSecureContext) {
        setStatus("insecure");
        return false;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return false;
      }

      let fallbackMessage: string | null = null;
      let stream: MediaStream;
      try {
        stream = await requestAudioStream(selectedDeviceIdRef.current);
      } catch (error) {
        if (!selectedDeviceIdRef.current) {
          throw error;
        }

        fallbackMessage = "Secilen mikrofon acilamadi; varsayilan mikrofon denendi.";
        stream = await requestAudioStream("");
      }

      const devices = await refreshInputDevices();
      const context = new AudioContext({ latencyHint: "interactive" });
      if (context.state === "suspended") {
        await context.resume();
      }

      const analyser = context.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0.15;

      const gain = context.createGain();
      gain.gain.value = ANALYSIS_GAIN;
      const source = context.createMediaStreamSource(stream);
      source.connect(gain);
      gain.connect(analyser);

      contextRef.current = context;
      streamRef.current = stream;
      analyserRef.current = analyser;
      const track = stream.getAudioTracks()[0] ?? null;

      setDiagnostics({
        contextState: normalizeContextState(context.state),
        deviceLabel: track?.label ?? "",
        inputDeviceCount: devices.length,
        lastError: fallbackMessage,
        signalState: "starting",
        silentFrameCount: 0,
        trackMuted: track?.muted ?? false,
        trackReadyState: normalizeTrackState(track?.readyState)
      });
      setStatus("listening");

      const buffer = new Float32Array(analyser.fftSize);
      const byteBuffer = new Uint8Array(analyser.fftSize);
      const frequencyData = new Float32Array(analyser.frequencyBinCount);
      const tick = () => {
        readTimeDomainData(analyser, buffer, byteBuffer);
        analyser.getFloatFrequencyData(frequencyData);
        const detectedFrame = createPitchFrame(
          buffer,
          context.sampleRate,
          performance.now(),
          minRmsRef.current,
          {
            fftSize: analyser.fftSize,
            frequencyData,
            target: targetRef.current
          }
        );
        const activity = calculateNoteActivity(
          detectedFrame,
          minRmsRef.current,
          noiseFloorRmsRef.current,
          noiseFloorPeakRef.current,
          noteActiveRef.current
        );
        noiseFloorRmsRef.current = activity.noiseFloorRms;
        noiseFloorPeakRef.current = activity.noiseFloorPeak;
        noteActiveRef.current = activity.noteActive;

        const nextFrame: PitchFrame = {
          ...detectedFrame,
          activityRatio: activity.activityRatio,
          noiseFloorRms: activity.noiseFloorRms,
          noteActive: activity.noteActive,
          noteOnset: activity.noteOnset
        };
        setFrame(nextFrame);

        const hasSignal = (nextFrame.peak ?? 0) >= SIGNAL_PEAK_FLOOR;
        silentFrameCountRef.current = hasSignal ? 0 : silentFrameCountRef.current + 1;

        if (nextFrame.timestamp - lastDiagnosticsUpdateRef.current > 250) {
          lastDiagnosticsUpdateRef.current = nextFrame.timestamp;
          setDiagnostics({
            contextState: normalizeContextState(context.state),
            deviceLabel: track?.label ?? "",
            inputDeviceCount: inputDevicesRef.current.length,
            lastError: fallbackMessage,
            signalState: hasSignal
              ? "receiving"
              : silentFrameCountRef.current > 15
                ? "silent"
                : "starting",
            silentFrameCount: silentFrameCountRef.current,
            trackMuted: track?.muted ?? false,
            trackReadyState: normalizeTrackState(track?.readyState)
          });
        }

        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
      return true;
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "blocked" : "error");
      setDiagnostics((current) => ({
        ...current,
        lastError: error instanceof Error ? error.message : "Audio could not start.",
        signalState: "idle"
      }));
      return false;
    }
  }, [closeAudioGraph, refreshInputDevices]);

  useEffect(() => stop, [stop]);

  return {
    diagnostics,
    frame,
    inputDevices,
    refreshInputDevices,
    status,
    start,
    stop,
    isListening: status === "listening"
  };
}

function requestAudioStream(deviceId: string): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      autoGainControl: true,
      channelCount: { ideal: 1 },
      deviceId: deviceId ? { exact: deviceId } : undefined,
      echoCancellation: false,
      noiseSuppression: false
    }
  });
}

function readTimeDomainData(
  analyser: AnalyserNode,
  buffer: Float32Array,
  byteBuffer: Uint8Array
): void {
  analyser.getFloatTimeDomainData(buffer);
  if (hasUsableSignal(buffer)) {
    return;
  }

  analyser.getByteTimeDomainData(byteBuffer);
  let maxDelta = 0;
  for (const sample of byteBuffer) {
    maxDelta = Math.max(maxDelta, Math.abs(sample - 128));
  }

  if (maxDelta <= 1) {
    buffer.fill(0);
    return;
  }

  for (let index = 0; index < byteBuffer.length; index += 1) {
    buffer[index] = (byteBuffer[index] - 128) / 128;
  }
}

function hasUsableSignal(buffer: Float32Array): boolean {
  for (const sample of buffer) {
    if (Math.abs(sample) >= SIGNAL_PEAK_FLOOR) {
      return true;
    }
  }
  return false;
}

function normalizeContextState(state: AudioContextState): AudioDiagnostics["contextState"] {
  return state === "running" || state === "suspended" || state === "closed" ? state : "none";
}

function normalizeTrackState(
  state: MediaStreamTrackState | undefined
): AudioDiagnostics["trackReadyState"] {
  return state === "live" || state === "ended" ? state : "none";
}
