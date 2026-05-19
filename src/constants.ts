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

export const EXAMPLE_TABS = [
  {
    id: "starter-riff",
    title: "Starter riff",
    mood: "Warm-up",
    tabText: EXAMPLE_TAB
  },
  {
    id: "pop-hook",
    title: "Pop hook",
    mood: "Parlak ve kolay",
    tabText: `e|--------------------------|
B|--------------------------|
G|---0---2---4---2---0------|
D|---------------------2----|
A|--------------------------|
E|--------------------------|`
  },
  {
    id: "rock-climb",
    title: "Rock climb",
    mood: "Drive",
    tabText: `e|--------------------------|
B|--------------------------|
G|-------------5---7---9----|
D|---5---7---9--------------|
A|--------------------------|
E|--------------------------|`
  },
  {
    id: "indie-run",
    title: "Indie run",
    mood: "Melodik",
    tabText: `e|--------------------------|
B|---------3---5---3--------|
G|---2---4-----------4---2--|
D|--------------------------|
A|--------------------------|
E|--------------------------|`
  },
  {
    id: "pentatonic-burst",
    title: "Pentatonic burst",
    mood: "Solo egzersizi",
    tabText: `e|----------------5---8-----|
B|----------5---8-----------|
G|----5---7-----------------|
D|--7-----------------------|
A|--------------------------|
E|--------------------------|`
  }
];

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
