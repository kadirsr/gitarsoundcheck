import { describe, expect, it } from "vitest";
import { createPitchFrame } from "../../../src/lib/audio/pitchDetection";

const SAMPLE_RATE = 44100;

describe("pitchDetection", () => {
  it("detects a fretted D-string G note", () => {
    const frame = createPitchFrame(createSineWave(196, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
    expect(Math.abs(frame.centsOff ?? 999)).toBeLessThan(10);
  });

  it("detects low guitar fundamentals without falling below guitar range", () => {
    const frame = createPitchFrame(createSineWave(82.41, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("E2");
    expect(frame.midi).toBe(40);
  });

  it("ignores sub-guitar frequencies that caused false low-note locks", () => {
    const frame = createPitchFrame(createSineWave(46.25, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.frequency).toBeNull();
    expect(frame.midi).toBeNull();
  });
});

function createSineWave(frequency: number, length: number): Float32Array {
  return Float32Array.from({ length }, (_, index) =>
    Math.sin((2 * Math.PI * frequency * index) / SAMPLE_RATE) * 0.4
  );
}
