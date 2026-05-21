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
  peak?: number;
  confidence: number;
  timestamp: number;
  activityRatio?: number;
  detectionMethod?: "none" | "pitchy" | "yin" | "mpm" | "target";
  inputThreshold?: number;
  noiseFloorRms?: number;
  noteActive?: boolean;
  noteOnset?: boolean;
  rejectionReason?: "rms-low" | "no-lock";
  targetScore?: number;
  targetRatio?: number;
};

export type PitchTarget = {
  frequency: number;
  midi: number;
};

export type AudioInputDevice = {
  deviceId: string;
  label: string;
};

export type AudioDiagnostics = {
  contextState: "closed" | "none" | "running" | "suspended";
  deviceLabel: string;
  inputDeviceCount: number;
  lastError: string | null;
  signalState: "idle" | "receiving" | "silent" | "starting";
  silentFrameCount: number;
  trackMuted: boolean;
  trackReadyState: "ended" | "live" | "none";
};

export type PracticeMode = "WAIT" | "FLOW";

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
  currentStep: number;
  correctCount: number;
  wrongCount: number;
  correctSequenceIndices: number[];
  wrongSequenceIndices: number[];
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
