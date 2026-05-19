import { STABLE_NOTE_MS, TOLERANCE_CENTS } from "../constants";
import type {
  ParsedNote,
  PitchFrame,
  PracticeMistake,
  PracticeMode,
  PracticeState,
  TolerancePreset
} from "../types";

export function createPracticeState(
  bpm = 60,
  mode: PracticeMode = "WAIT"
): PracticeState {
  return {
    status: "idle",
    mode,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    startedAt: null,
    completedAt: null,
    bpm,
    stableSince: null,
    recentMistakes: []
  };
}

export function startPractice(state: PracticeState, now = Date.now()): PracticeState {
  return {
    ...state,
    status: "listening",
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    startedAt: now,
    completedAt: null,
    stableSince: null,
    recentMistakes: []
  };
}

export function resetPractice(
  bpm: number,
  mode: PracticeMode,
  now: number | null = null
): PracticeState {
  return {
    ...createPracticeState(bpm, mode),
    startedAt: now
  };
}

export function markCurrentCorrect(
  state: PracticeState,
  notes: ParsedNote[],
  now = Date.now()
): PracticeState {
  if (state.status !== "listening" || state.currentIndex >= notes.length) {
    return state;
  }

  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= notes.length;

  return {
    ...state,
    currentIndex: nextIndex,
    correctCount: state.correctCount + 1,
    status: completed ? "completed" : state.status,
    completedAt: completed ? now : state.completedAt,
    stableSince: null
  };
}

export function evaluatePitchFrame(
  state: PracticeState,
  notes: ParsedNote[],
  frame: PitchFrame,
  tolerancePreset: TolerancePreset
): PracticeState {
  if (state.status !== "listening" || state.currentIndex >= notes.length) {
    return state;
  }

  const expected = notes[state.currentIndex];
  if (frame.midi === null || frame.centsOff === null) {
    return { ...state, stableSince: null };
  }

  const isCorrect =
    frame.midi === expected.expectedMidi &&
    Math.abs(frame.centsOff) <= TOLERANCE_CENTS[tolerancePreset];

  if (!isCorrect) {
    return recordMistakeIfNeeded(
      { ...state, stableSince: null },
      expected,
      frame,
      frame.timestamp
    );
  }

  const stableSince = state.stableSince ?? frame.timestamp;
  if (frame.timestamp - stableSince >= STABLE_NOTE_MS) {
    return markCurrentCorrect({ ...state, stableSince }, notes, frame.timestamp);
  }

  return { ...state, stableSince };
}

function recordMistakeIfNeeded(
  state: PracticeState,
  expected: ParsedNote,
  frame: PitchFrame,
  now: number
): PracticeState {
  const previous = state.recentMistakes[0];
  if (previous && now - previous.timestamp < 350) {
    return state;
  }

  const mistake: PracticeMistake = {
    expectedNoteName: expected.expectedNoteName,
    detectedNoteName: frame.noteName,
    expectedMidi: expected.expectedMidi,
    detectedMidi: frame.midi,
    stringLabel: expected.stringLabel,
    fret: expected.fret,
    sequenceIndex: expected.sequenceIndex,
    timestamp: now
  };

  return {
    ...state,
    wrongCount: state.wrongCount + 1,
    recentMistakes: [mistake, ...state.recentMistakes].slice(0, 8)
  };
}
