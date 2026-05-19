export type GuitarString = "E_HIGH" | "B" | "G" | "D" | "A" | "E_LOW";

export type TabGridCellStatus =
  | "empty"
  | "current"
  | "correct"
  | "wrong"
  | "pending";

export type TabGridCell = {
  stringName: GuitarString;
  stepIndex: number;
  fret: number | null;
  status: TabGridCellStatus;
};

export type TabGrid = {
  stepCount: number;
  cells: Record<GuitarString, Array<number | null>>;
  measureMarkers: number[];
};

export type ParsedNote = {
  id: string;
  stringName: GuitarString;
  stringLabel: string;
  fret: number;
  columnIndex: number;
  sequenceIndex: number;
  expectedNoteName: string;
  expectedMidi: number;
  expectedFrequency: number;
};

export type ParseResult = {
  notes: ParsedNote[];
  warnings: string[];
};

export type PitchFrame = {
  frequency: number | null;
  midi: number | null;
  noteName: string | null;
  centsOff: number | null;
  rms: number;
  confidence: number;
  timestamp: number;
};

export type PracticeMode = "WAIT" | "BPM_STRICT";

export type PracticeStatus = "idle" | "listening" | "paused" | "completed";

export type PracticeMistake = {
  expectedNoteName: string;
  detectedNoteName: string | null;
  expectedMidi: number;
  detectedMidi: number | null;
  stringLabel: string;
  fret: number;
  sequenceIndex: number;
  timestamp: number;
};

export type PracticeState = {
  status: PracticeStatus;
  mode: PracticeMode;
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  startedAt: number | null;
  completedAt: number | null;
  bpm: number;
  stableSince: number | null;
  recentMistakes: PracticeMistake[];
};

export type TolerancePreset = "EASY" | "NORMAL" | "STRICT";

export type SavedTab = {
  id: string;
  title: string;
  tabText: string;
  grid?: TabGrid;
  createdAt: string;
  updatedAt: string;
};
