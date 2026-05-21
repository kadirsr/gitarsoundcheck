import type { PitchFrame } from "../../types";

const ATTACK_MIN_RMS_MULTIPLIER = 3;
const ATTACK_MIN_PEAK_MULTIPLIER = 8;
const ATTACK_PEAK_RATIO = 2.4;
const ATTACK_RMS_RATIO = 3.6;
const LEGACY_ACTIVE_CONFIDENCE = 0.62;
const PITCHY_ACTIVE_CONFIDENCE = 0.82;
const SUSTAIN_MIN_RMS_MULTIPLIER = 2.4;
const SUSTAIN_MIN_PEAK_MULTIPLIER = 5;
const SUSTAIN_PEAK_RATIO = 1.45;
const SUSTAIN_RMS_RATIO = 2.1;

export type NoteActivity = {
  activityRatio: number;
  noiseFloorPeak: number;
  noiseFloorRms: number;
  noteActive: boolean;
  noteOnset: boolean;
};

export function calculateNoteActivity(
  frame: PitchFrame,
  minRms: number,
  currentNoiseFloorRms: number,
  currentNoiseFloorPeak: number,
  wasActive: boolean
): NoteActivity {
  const rms = frame.rms;
  const peak = frame.peak ?? 0;
  const floorRms =
    currentNoiseFloorRms > 0 ? currentNoiseFloorRms : Math.max(minRms, rms);
  const floorPeak =
    currentNoiseFloorPeak > 0
      ? currentNoiseFloorPeak
      : Math.max(minRms * ATTACK_MIN_PEAK_MULTIPLIER, peak);
  const hasReliablePitch = isPlayablePitchFrame(frame);
  const isAttack =
    hasReliablePitch &&
    rms >= Math.max(minRms * ATTACK_MIN_RMS_MULTIPLIER, floorRms * ATTACK_RMS_RATIO) &&
    peak >= Math.max(minRms * ATTACK_MIN_PEAK_MULTIPLIER, floorPeak * ATTACK_PEAK_RATIO);
  const canSustain =
    wasActive &&
    hasReliablePitch &&
    rms >= Math.max(minRms * SUSTAIN_MIN_RMS_MULTIPLIER, floorRms * SUSTAIN_RMS_RATIO) &&
    peak >= Math.max(minRms * SUSTAIN_MIN_PEAK_MULTIPLIER, floorPeak * SUSTAIN_PEAK_RATIO);
  const noteActive = isAttack || canSustain;
  const nextFloorRms = noteActive ? floorRms : smoothNoiseFloor(floorRms, rms, minRms);
  const nextFloorPeak = noteActive
    ? floorPeak
    : smoothNoiseFloor(floorPeak, peak, minRms * ATTACK_MIN_PEAK_MULTIPLIER);

  return {
    activityRatio: rms / Math.max(minRms, floorRms),
    noiseFloorPeak: nextFloorPeak,
    noiseFloorRms: nextFloorRms,
    noteActive,
    noteOnset: isAttack && !wasActive
  };
}

export function isPlayablePitchFrame(frame: PitchFrame): boolean {
  if (frame.noteActive === false || frame.frequency === null || frame.midi === null) {
    return false;
  }

  switch (frame.detectionMethod) {
    case "pitchy":
      return frame.confidence >= PITCHY_ACTIVE_CONFIDENCE;
    case "yin":
    case "mpm":
      return frame.confidence >= LEGACY_ACTIVE_CONFIDENCE;
    case "target":
    case "none":
      return false;
    default:
      return frame.confidence >= PITCHY_ACTIVE_CONFIDENCE;
  }
}

function smoothNoiseFloor(current: number, next: number, minimum: number): number {
  if (current === 0) {
    return Math.max(minimum, next);
  }

  return Math.max(minimum, current * 0.96 + next * 0.04);
}
