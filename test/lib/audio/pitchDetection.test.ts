import { describe, expect, it } from "vitest";
import { createPitchFrame } from "../../../src/lib/audio/pitchDetection";

const SAMPLE_RATE = 44100;

describe("pitchDetection", () => {
  it("detects a fretted D-string G note", () => {
    const frame = createPitchFrame(createSineWave(196, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
    expect(Math.abs(frame.centsOff ?? 999)).toBeLessThan(20);
  });

  it("detects low guitar fundamentals without falling below guitar range", () => {
    const frame = createPitchFrame(createSineWave(82.41, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("E2");
    expect(frame.midi).toBe(40);
  });

  it("detects a noisy harmonic-rich electric guitar style signal", () => {
    const frame = createPitchFrame(createGuitarLikeWave(196, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
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

function createGuitarLikeWave(frequency: number, length: number): Float32Array {
  return Float32Array.from({ length }, (_, index) => {
    const time = index / SAMPLE_RATE;
    const envelope = Math.exp(-time * 5);
    const fundamental = Math.sin(2 * Math.PI * frequency * time) * 0.15;
    const second = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.3;
    const third = Math.sin(2 * Math.PI * frequency * 3 * time) * 0.18;
    const noise = Math.sin(2 * Math.PI * 37 * time) * 0.015;

    return (fundamental + second + third + noise) * envelope;
  });
}
