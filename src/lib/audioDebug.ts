import { STEP_WIDTH, TOLERANCE_CENTS } from "../constants";
import { isPlayablePitchFrame } from "./audio/noteActivity";
import type { ParsedNote, PitchFrame, PracticeState, TolerancePreset } from "../types";

const DEBUG_STORAGE_KEY = "tabflow:debug-audio";

type AudioDebugWindow = Window & {
  __TABFLOW_AUDIO_DEBUG__?: AudioDebugEntry[];
};

type AudioDebugEntry = {
  at: string;
  status: PracticeState["status"];
  mode: PracticeState["mode"];
  currentIndex: number;
  currentStep: number;
  expected: string;
  expectedMidi: number | null;
  expectedFrequency: number | null;
  detected: string;
  detectedMidi: number | null;
  detectedFrequency: number | null;
  centsOff: number | null;
  midiDelta: number | null;
  rms: number;
  peak: number | null;
  activityRatio: number | null;
  confidence: number;
  detectionMethod: string;
  inputThreshold: number | null;
  noiseFloorRms: number | null;
  noteActive: boolean | null;
  noteOnset: boolean | null;
  rejectionReason: string | null;
  targetScore: number | null;
  targetHarmonicHits: number | null;
  tolerance: number;
  result: string;
  reason: string;
};

export function loadAudioDebugEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const fromUrl = new URLSearchParams(window.location.search).get("debugAudio");
  if (fromUrl === "1") {
    window.localStorage.setItem(DEBUG_STORAGE_KEY, "1");
    return true;
  }

  return window.localStorage.getItem(DEBUG_STORAGE_KEY) === "1";
}

export function saveAudioDebugEnabled(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  if (enabled) {
    window.localStorage.setItem(DEBUG_STORAGE_KEY, "1");
    return;
  }

  window.localStorage.removeItem(DEBUG_STORAGE_KEY);
}

export function logAudioDebugFrame({
  frame,
  notes,
  practiceState,
  tolerance
}: {
  frame: PitchFrame;
  notes: ParsedNote[];
  practiceState: PracticeState;
  tolerance: TolerancePreset;
}): void {
  const expected = getExpectedNote(practiceState, notes);
  const toleranceCents = TOLERANCE_CENTS[tolerance];
  const entry = createDebugEntry(frame, expected, practiceState, toleranceCents);
  const debugWindow = window as AudioDebugWindow;

  debugWindow.__TABFLOW_AUDIO_DEBUG__ = [
    ...(debugWindow.__TABFLOW_AUDIO_DEBUG__ ?? []),
    entry
  ].slice(-80);

  console.groupCollapsed(
    `[TabFlow audio] ${entry.result}: ${entry.reason} | expected=${entry.expected} detected=${entry.detected}`
  );
  console.table(entry);
  console.info("Recent frames: window.__TABFLOW_AUDIO_DEBUG__");
  console.groupEnd();
}

function getExpectedNote(state: PracticeState, notes: ParsedNote[]): ParsedNote | null {
  if (state.mode === "FLOW") {
    return notes.find((note) => getNoteStep(note) === state.currentStep) ?? null;
  }

  return notes[state.currentIndex] ?? null;
}

function createDebugEntry(
  frame: PitchFrame,
  expected: ParsedNote | null,
  state: PracticeState,
  tolerance: number
): AudioDebugEntry {
  const midiDelta =
    expected && frame.midi !== null ? frame.midi - expected.expectedMidi : null;
  const withinTolerance =
    frame.centsOff !== null && Math.abs(frame.centsOff) <= tolerance;
  const exactMidi = midiDelta === 0;
  const playable = isPlayablePitchFrame(frame);
  const result = expected && playable && exactMidi && withinTolerance ? "match" : "miss";
  const reason = getReason({ expected, exactMidi, frame, midiDelta, tolerance, withinTolerance });

  return {
    at: new Date().toISOString(),
    status: state.status,
    mode: state.mode,
    currentIndex: state.currentIndex,
    currentStep: state.currentStep,
    expected: expected
      ? `${expected.stringLabel} string fret ${expected.fret} (${expected.expectedNoteName})`
      : "-",
    expectedMidi: expected?.expectedMidi ?? null,
    expectedFrequency: expected?.expectedFrequency ?? null,
    detected: frame.noteName ?? "-",
    detectedMidi: frame.midi,
    detectedFrequency: frame.frequency,
    centsOff: frame.centsOff,
    midiDelta,
    rms: Number(frame.rms.toFixed(6)),
    peak: frame.peak === undefined ? null : Number(frame.peak.toFixed(6)),
    activityRatio:
      frame.activityRatio === undefined ? null : Number(frame.activityRatio.toFixed(2)),
    confidence: Number(frame.confidence.toFixed(3)),
    detectionMethod: frame.detectionMethod ?? "none",
    inputThreshold:
      frame.inputThreshold === undefined ? null : Number(frame.inputThreshold.toFixed(4)),
    noiseFloorRms:
      frame.noiseFloorRms === undefined ? null : Number(frame.noiseFloorRms.toFixed(6)),
    noteActive: frame.noteActive ?? null,
    noteOnset: frame.noteOnset ?? null,
    rejectionReason: frame.rejectionReason ?? null,
    targetScore:
      frame.targetScore === undefined ? null : Number(frame.targetScore.toFixed(3)),
    targetHarmonicHits: frame.targetRatio ?? null,
    tolerance,
    result,
    reason
  };
}

function getReason({
  expected,
  exactMidi,
  frame,
  midiDelta,
  tolerance,
  withinTolerance
}: {
  expected: ParsedNote | null;
  exactMidi: boolean;
  frame: PitchFrame;
  midiDelta: number | null;
  tolerance: number;
  withinTolerance: boolean;
}): string {
  if (!expected) {
    return "current step has no note";
  }

  if (frame.noteActive === false) {
    return "microphone signal is below the active-note gate";
  }

  if (frame.detectionMethod === "target") {
    return "target harmonic fallback is diagnostic only; practice needs a real pitch lock";
  }

  if (frame.detectionMethod === "pitchy" && frame.confidence < 0.82) {
    return `Pitchy confidence ${frame.confidence.toFixed(2)} below active-note gate`;
  }

  if (frame.frequency === null || frame.midi === null || frame.centsOff === null) {
    if ((frame.peak ?? 0) === 0) {
      return "input stream is silent or disconnected";
    }

    if (frame.rejectionReason === "rms-low") {
      return `RMS ${frame.rms.toFixed(6)} below input threshold ${(frame.inputThreshold ?? 0).toFixed(4)}`;
    }

    if (frame.targetScore !== undefined) {
      return `target harmonic score ${frame.targetScore.toFixed(2)} below threshold`;
    }

    return "audio level exists but pitch detector did not lock a frequency";
  }

  if (!exactMidi) {
    return `detected MIDI differs by ${midiDelta ?? "-"} semitone(s)`;
  }

  if (!withinTolerance) {
    return `same MIDI but outside ±${tolerance} cents`;
  }

  return "accepted";
}

function getNoteStep(note: ParsedNote): number {
  return Math.floor(note.columnIndex / STEP_WIDTH);
}
