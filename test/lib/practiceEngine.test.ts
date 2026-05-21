import { describe, expect, it } from "vitest";
import { parseTab } from "../../src/lib/tabParser";
import {
  advanceFlowByTime,
  createPracticeState,
  evaluatePitchFrame,
  markCurrentCorrect,
  startPractice
} from "../../src/lib/practiceEngine";
import type { PitchFrame } from "../../src/types";

const notes = parseTab(`e|-------|
B|-------|
G|-------|
D|0--2---|
A|-------|
E|-------|`).notes;

describe("practiceEngine", () => {
  it("advances when marked correct", () => {
    const state = startPractice(createPracticeState());
    const next = markCurrentCorrect(state, notes);
    expect(next.currentIndex).toBe(1);
    expect(next.correctCount).toBe(1);
    expect(next.correctSequenceIndices).toEqual([0]);
  });

  it("does not advance on a wrong pitch", () => {
    const state = startPractice(createPracticeState(), 0);
    const frame: PitchFrame = {
      frequency: 329.63,
      midi: 64,
      noteName: "E4",
      centsOff: 0,
      rms: 0.1,
      confidence: 1,
      timestamp: 50
    };
    const next = evaluatePitchFrame(state, notes, frame, "NORMAL");
    expect(next.currentIndex).toBe(0);
    expect(next.wrongCount).toBe(1);
  });

  it("completes the exercise", () => {
    let state = startPractice(createPracticeState(), 0);
    state = markCurrentCorrect(state, notes, 1);
    state = markCurrentCorrect(state, notes, 2);
    expect(state.status).toBe("completed");
  });

  it("advances after a stable correct pitch", () => {
    let state = startPractice(createPracticeState(), 0);
    const frame = {
      frequency: 146.83,
      midi: 50,
      noteName: "D3",
      centsOff: 0,
      rms: 0.1,
      confidence: 1
    };

    state = evaluatePitchFrame(state, notes, { ...frame, timestamp: 0 }, "NORMAL");
    state = evaluatePitchFrame(state, notes, { ...frame, timestamp: 120 }, "NORMAL");
    expect(state.currentIndex).toBe(1);
  });

  it("does not accept matching ambient noise as a played note", () => {
    let state = startPractice(createPracticeState(), 0);
    const frame: PitchFrame = {
      frequency: 146.83,
      midi: 50,
      noteName: "D3",
      centsOff: 0,
      rms: 0.003,
      peak: 0.006,
      confidence: 1,
      noteActive: false,
      timestamp: 120
    };

    state = evaluatePitchFrame(state, notes, frame, "NORMAL");
    expect(state.currentIndex).toBe(0);
    expect(state.correctCount).toBe(0);
    expect(state.wrongCount).toBe(0);
  });

  it("marks flow mode notes correct without waiting for stability", () => {
    const state = startPractice(createPracticeState(60, "FLOW"), 0);
    const frame: PitchFrame = {
      frequency: 146.83,
      midi: 50,
      noteName: "D3",
      centsOff: 0,
      rms: 0.1,
      confidence: 1,
      timestamp: 250
    };

    const next = evaluatePitchFrame(state, notes, frame, "NORMAL");
    expect(next.currentIndex).toBe(0);
    expect(next.correctSequenceIndices).toEqual([0]);
    expect(next.correctCount).toBe(1);
  });

  it("keeps flowing by bpm and marks missed notes wrong", () => {
    const state = startPractice(createPracticeState(60, "FLOW"), 0);
    const next = advanceFlowByTime(state, notes, 1100);

    expect(next.currentIndex).toBe(1);
    expect(next.wrongSequenceIndices).toEqual([0]);
    expect(next.wrongCount).toBe(1);
  });

  it("completes flow mode after the final bpm slot", () => {
    const state = startPractice(createPracticeState(60, "FLOW"), 0);
    const next = advanceFlowByTime(state, notes, 2100);

    expect(next.currentIndex).toBe(2);
    expect(next.status).toBe("completed");
  });
});
