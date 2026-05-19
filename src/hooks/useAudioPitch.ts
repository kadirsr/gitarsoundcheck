import { useCallback, useEffect, useRef, useState } from "react";
import { createPitchFrame } from "../lib/audio/pitchDetection";
import type { PitchFrame, PitchTarget } from "../types";

type AudioStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "blocked"
  | "insecure"
  | "unavailable"
  | "error";

export function useAudioPitch(minRms: number, target: PitchTarget | null = null) {
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [frame, setFrame] = useState<PitchFrame | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef<PitchTarget | null>(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void contextRef.current?.close();
    contextRef.current = null;
    analyserRef.current = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus("requesting");
      if (!window.isSecureContext) {
        setStatus("insecure");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false
        }
      });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0.15;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      contextRef.current = context;
      streamRef.current = stream;
      analyserRef.current = analyser;
      setStatus("listening");

      const buffer = new Float32Array(analyser.fftSize);
      const frequencyData = new Float32Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getFloatTimeDomainData(buffer);
        analyser.getFloatFrequencyData(frequencyData);
        setFrame(
          createPitchFrame(buffer, context.sampleRate, performance.now(), minRms, {
            fftSize: analyser.fftSize,
            frequencyData,
            target: targetRef.current
          })
        );
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "blocked" : "error");
    }
  }, [minRms]);

  useEffect(() => stop, [stop]);

  return {
    frame,
    status,
    start,
    stop,
    isListening: status === "listening"
  };
}
