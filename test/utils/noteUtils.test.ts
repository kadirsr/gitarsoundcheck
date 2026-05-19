import { describe, expect, it } from "vitest";
import {
  centsOffFromMidi,
  getFrettedMidi,
  midiToFrequency,
  midiToNoteName
} from "../../src/utils/noteUtils";

describe("noteUtils", () => {
  it("maps MIDI 69 to A4", () => {
    expect(midiToNoteName(69)).toBe("A4");
  });

  it("maps A4 to 440 Hz", () => {
    expect(midiToFrequency(69)).toBeCloseTo(440);
  });

  it("calculates fretted MIDI values", () => {
    expect(getFrettedMidi("D", 2)).toBe(52);
  });

  it("calculates cents offset", () => {
    expect(centsOffFromMidi(440, 69)).toBe(0);
  });
});
