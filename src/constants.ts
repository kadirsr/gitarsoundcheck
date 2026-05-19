import type { GuitarString, TolerancePreset } from "./types";

export const GUITAR_STRINGS: Array<{
  name: GuitarString;
  label: string;
  midi: number;
}> = [
  { name: "E_HIGH", label: "e", midi: 64 },
  { name: "B", label: "B", midi: 59 },
  { name: "G", label: "G", midi: 55 },
  { name: "D", label: "D", midi: 50 },
  { name: "A", label: "A", midi: 45 },
  { name: "E_LOW", label: "E", midi: 40 }
];

export const STRING_BY_LABEL = new Map(
  GUITAR_STRINGS.map((string) => [string.label, string])
);

export const EXAMPLE_TAB = `e|--------------------------|
B|--------------------------|
G|---------0---2---4--------|
D|---0---2------------------|
A|--------------------------|
E|--------------------------|`;

export const DEFAULT_STEP_COUNT = 32;
export const MIN_STEP_COUNT = 8;
export const MAX_STEP_COUNT = 256;
export const STEP_WIDTH = 3;
export const MIN_RMS = 0.01;
export const STABLE_NOTE_MS = 100;

export const TOLERANCE_CENTS: Record<TolerancePreset, number> = {
  EASY: 50,
  NORMAL: 35,
  STRICT: 20
};
