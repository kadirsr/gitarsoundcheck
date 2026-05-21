import { describe, expect, it } from "vitest";
import {
  calculateNoteActivity,
  isPlayablePitchFrame
} from "../../../src/lib/audio/noteActivity";
import type { PitchFrame } from "../../../src/types";

const baseFrame: PitchFrame = {
  frequency: 146.83,
  midi: 50,
  noteName: "D3",
  centsOff: 0,
  rms: 0.002,
  peak: 0.006,
  confidence: 0.94,
  detectionMethod: "pitchy",
  timestamp: 0
};

describe("noteActivity", () => {
  it("keeps steady ambient sound below the active-note gate", () => {
    const first = calculateNoteActivity(
      { ...baseFrame, rms: 0.08, peak: 0.16 },
      0.0005,
      0,
      0,
      false
    );
    const second = calculateNoteActivity(
      { ...baseFrame, rms: 0.082, peak: 0.17, timestamp: 16 },
      0.0005,
      first.noiseFloorRms,
      first.noiseFloorPeak,
      first.noteActive
    );

    expect(first.noteActive).toBe(false);
    expect(second.noteActive).toBe(false);
  });

  it("opens on a strong playable attack and sustains while the note decays", () => {
    const attack = calculateNoteActivity(
      { ...baseFrame, rms: 0.04, peak: 0.12 },
      0.0005,
      0.004,
      0.03,
      false
    );
    const sustain = calculateNoteActivity(
      { ...baseFrame, rms: 0.03, peak: 0.06, timestamp: 16 },
      0.0005,
      attack.noiseFloorRms,
      attack.noiseFloorPeak,
      attack.noteActive
    );

    expect(attack.noteActive).toBe(true);
    expect(attack.noteOnset).toBe(true);
    expect(sustain.noteActive).toBe(true);
    expect(sustain.noteOnset).toBe(false);
  });

  it("does not treat target fallback as a playable frame", () => {
    expect(isPlayablePitchFrame({ ...baseFrame, detectionMethod: "target" })).toBe(false);
  });

  it("does not treat low-confidence Pitchy frames as playable", () => {
    expect(isPlayablePitchFrame({ ...baseFrame, confidence: 0.7 })).toBe(false);
  });
});
