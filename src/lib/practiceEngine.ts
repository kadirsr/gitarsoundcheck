import { STABLE_NOTE_MS, STEP_WIDTH, TOLERANCE_CENTS } from "../constants";
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
    currentStep: 0,
    correctCount: 0,
    wrongCount: 0,
    correctSequenceIndices: [],
    wrongSequenceIndices: [],
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
    currentStep: 0,
    correctCount: 0,
    wrongCount: 0,
    correctSequenceIndices: [],
    wrongSequenceIndices: [],
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
  const nextNote = notes[nextIndex] ?? null;
  const correctSequenceIndices = addUnique(
    state.correctSequenceIndices,
    notes[state.currentIndex].sequenceIndex
  );

  return {
    ...state,
    currentIndex: nextIndex,
    currentStep: nextNote ? getNoteStep(nextNote) : state.currentStep,
    correctSequenceIndices,
    wrongSequenceIndices: state.wrongSequenceIndices.filter(
      (sequenceIndex) => sequenceIndex !== notes[state.currentIndex].sequenceIndex
    ),
    recentMistakes: state.recentMistakes.filter(
      (mistake) => mistake.sequenceIndex !== notes[state.currentIndex].sequenceIndex
    ),
    correctCount: correctSequenceIndices.length,
    wrongCount: state.wrongSequenceIndices.filter(
      (sequenceIndex) => sequenceIndex !== notes[state.currentIndex].sequenceIndex
    ).length,
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

  const expected =
    state.mode === "FLOW" ? findNoteAtStep(notes, state.currentStep) : notes[state.currentIndex];
  if (!expected) {
    return { ...state, stableSince: null };
  }

  if (frame.midi === null || frame.centsOff === null) {
    return { ...state, stableSince: null };
  }

  const isCorrect =
    frame.midi === expected.expectedMidi &&
    Math.abs(frame.centsOff) <= TOLERANCE_CENTS[tolerancePreset];

  if (state.mode === "FLOW") {
    if (isCorrect) {
      return markFlowCorrect(state, expected, frame.timestamp);
    }

    return recordMistakeIfNeeded({ ...state, stableSince: null }, expected, frame, frame.timestamp);
  }

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

export function advanceFlowByTime(
  state: PracticeState,
  notes: ParsedNote[],
  now = Date.now()
): PracticeState {
  if (
    state.status !== "listening" ||
    state.mode !== "FLOW" ||
    state.startedAt === null ||
    notes.length === 0
  ) {
    return state;
  }

  const msPerStep = 60000 / Math.max(1, state.bpm);
  const targetStep = Math.max(0, Math.floor((now - state.startedAt) / msPerStep));
  const lastStep = getNoteStep(notes[notes.length - 1]);

  if (targetStep <= state.currentStep) {
    return state;
  }

  let nextState = state;
  for (const note of notes) {
    const noteStep = getNoteStep(note);
    if (
      noteStep < state.currentStep ||
      noteStep >= targetStep ||
      nextState.correctSequenceIndices.includes(note.sequenceIndex)
    ) {
      continue;
    }

    nextState = markFlowWrong(nextState, note, now, null);
  }

  const completed = targetStep > lastStep;
  return {
    ...nextState,
    currentStep: targetStep,
    currentIndex: findNextNoteIndex(notes, targetStep),
    status: completed ? "completed" : nextState.status,
    completedAt: completed ? now : nextState.completedAt,
    stableSince: null
  };
}

function markFlowCorrect(
  state: PracticeState,
  expected: ParsedNote,
  now: number
): PracticeState {
  const correctSequenceIndices = addUnique(state.correctSequenceIndices, expected.sequenceIndex);
  const wrongSequenceIndices = state.wrongSequenceIndices.filter(
    (sequenceIndex) => sequenceIndex !== expected.sequenceIndex
  );

  return {
    ...state,
    correctSequenceIndices,
    wrongSequenceIndices,
    recentMistakes: state.recentMistakes.filter(
      (mistake) => mistake.sequenceIndex !== expected.sequenceIndex
    ),
    correctCount: correctSequenceIndices.length,
    wrongCount: wrongSequenceIndices.length,
    stableSince: now
  };
}

function recordMistakeIfNeeded(
  state: PracticeState,
  expected: ParsedNote,
  frame: PitchFrame,
  now: number
): PracticeState {
  const previous = state.recentMistakes[0];
  if (
    state.wrongSequenceIndices.includes(expected.sequenceIndex) ||
    (previous && now - previous.timestamp < 350)
  ) {
    return state;
  }

  return markFlowWrong(state, expected, now, frame);
}

function markFlowWrong(
  state: PracticeState,
  expected: ParsedNote,
  now: number,
  frame: PitchFrame | null
): PracticeState {
  if (state.correctSequenceIndices.includes(expected.sequenceIndex)) {
    return state;
  }

  const mistake: PracticeMistake = {
    expectedNoteName: expected.expectedNoteName,
    detectedNoteName: frame?.noteName ?? null,
    expectedMidi: expected.expectedMidi,
    detectedMidi: frame?.midi ?? null,
    stringLabel: expected.stringLabel,
    fret: expected.fret,
    sequenceIndex: expected.sequenceIndex,
    timestamp: now
  };

  const wrongSequenceIndices = addUnique(state.wrongSequenceIndices, expected.sequenceIndex);

  return {
    ...state,
    wrongSequenceIndices,
    wrongCount: wrongSequenceIndices.length,
    recentMistakes: [mistake, ...state.recentMistakes].slice(0, 8)
  };
}

function addUnique(values: number[], value: number): number[] {
  return values.includes(value) ? values : [...values, value];
}

function getNoteStep(note: ParsedNote): number {
  return Math.floor(note.columnIndex / STEP_WIDTH);
}

function findNoteAtStep(notes: ParsedNote[], stepIndex: number): ParsedNote | null {
  return notes.find((note) => getNoteStep(note) === stepIndex) ?? null;
}

function findNextNoteIndex(notes: ParsedNote[], stepIndex: number): number {
  const index = notes.findIndex((note) => getNoteStep(note) >= stepIndex);
  return index === -1 ? notes.length : index;
}
