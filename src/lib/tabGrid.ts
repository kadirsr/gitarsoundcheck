import {
  DEFAULT_STEP_COUNT,
  GUITAR_STRINGS,
  MAX_STEP_COUNT,
  MIN_STEP_COUNT,
  STEP_WIDTH
} from "../constants";
import type { GuitarString, TabGrid } from "../types";
import { parseTab } from "./tabParser";

export function createEmptyGrid(stepCount = DEFAULT_STEP_COUNT): TabGrid {
  const safeStepCount = clampStepCount(stepCount);
  return {
    stepCount: safeStepCount,
    cells: Object.fromEntries(
      GUITAR_STRINGS.map((string) => [
        string.name,
        Array.from<number | null>({ length: safeStepCount }).fill(null)
      ])
    ) as TabGrid["cells"],
    measureMarkers: []
  };
}

export function setGridNote(
  grid: TabGrid,
  stringName: GuitarString,
  stepIndex: number,
  fret: number | null
): TabGrid {
  assertStep(grid, stepIndex);
  if (fret !== null && (fret < 0 || fret > 24 || !Number.isInteger(fret))) {
    throw new Error("Fret value must be between 0 and 24.");
  }

  const cells = cloneCells(grid);
  for (const string of GUITAR_STRINGS) {
    cells[string.name][stepIndex] = null;
  }
  cells[stringName][stepIndex] = fret;

  return { ...grid, cells };
}

export function clearGrid(grid: TabGrid): TabGrid {
  return createEmptyGrid(grid.stepCount);
}

export function resizeGrid(grid: TabGrid, nextStepCount: number): TabGrid {
  const stepCount = clampStepCount(nextStepCount);
  const cells = cloneCells(grid);

  for (const string of GUITAR_STRINGS) {
    const row = cells[string.name];
    if (row.length > stepCount) {
      cells[string.name] = row.slice(0, stepCount);
    } else {
      cells[string.name] = [
        ...row,
        ...Array.from<number | null>({ length: stepCount - row.length }).fill(null)
      ];
    }
  }

  return {
    stepCount,
    cells,
    measureMarkers: grid.measureMarkers.filter((marker) => marker < stepCount)
  };
}

export function addStep(grid: TabGrid, atIndex = grid.stepCount): TabGrid {
  const insertIndex = Math.max(0, Math.min(grid.stepCount, atIndex));
  const cells = cloneCells(grid);

  for (const string of GUITAR_STRINGS) {
    cells[string.name].splice(insertIndex, 0, null);
  }

  return resizeGrid(
    {
      ...grid,
      stepCount: grid.stepCount + 1,
      cells,
      measureMarkers: grid.measureMarkers.map((marker) =>
        marker >= insertIndex ? marker + 1 : marker
      )
    },
    grid.stepCount + 1
  );
}

export function removeStep(grid: TabGrid, atIndex = grid.stepCount - 1): TabGrid {
  if (grid.stepCount <= MIN_STEP_COUNT) {
    return grid;
  }

  const removeIndex = Math.max(0, Math.min(grid.stepCount - 1, atIndex));
  const cells = cloneCells(grid);

  for (const string of GUITAR_STRINGS) {
    cells[string.name].splice(removeIndex, 1);
  }

  return {
    stepCount: grid.stepCount - 1,
    cells,
    measureMarkers: grid.measureMarkers
      .filter((marker) => marker !== removeIndex)
      .map((marker) => (marker > removeIndex ? marker - 1 : marker))
  };
}

export function toggleMeasureMarker(grid: TabGrid, stepIndex: number): TabGrid {
  assertStep(grid, stepIndex);
  const exists = grid.measureMarkers.includes(stepIndex);
  return {
    ...grid,
    measureMarkers: exists
      ? grid.measureMarkers.filter((marker) => marker !== stepIndex)
      : [...grid.measureMarkers, stepIndex].sort((left, right) => left - right)
  };
}

export function gridFromAscii(tabText: string): TabGrid {
  const parsed = parseTab(tabText);
  const maxStep =
    parsed.notes.length === 0
      ? DEFAULT_STEP_COUNT
      : Math.max(
          DEFAULT_STEP_COUNT,
          ...parsed.notes.map((note) => Math.floor(note.columnIndex / STEP_WIDTH) + 1)
        );
  let grid = createEmptyGrid(maxStep);

  for (const note of parsed.notes) {
    const stepIndex = Math.floor(note.columnIndex / STEP_WIDTH);
    grid = setGridNote(grid, note.stringName, stepIndex, note.fret);
  }

  return grid;
}

export function getGridNotes(grid: TabGrid) {
  const notes = [];
  for (let stepIndex = 0; stepIndex < grid.stepCount; stepIndex += 1) {
    for (const string of GUITAR_STRINGS) {
      const fret = grid.cells[string.name][stepIndex];
      if (fret !== null) {
        notes.push({ stringName: string.name, stringLabel: string.label, stepIndex, fret });
      }
    }
  }
  return notes;
}

function cloneCells(grid: TabGrid): TabGrid["cells"] {
  return Object.fromEntries(
    GUITAR_STRINGS.map((string) => [string.name, [...grid.cells[string.name]]])
  ) as TabGrid["cells"];
}

function clampStepCount(stepCount: number): number {
  return Math.max(MIN_STEP_COUNT, Math.min(MAX_STEP_COUNT, Math.round(stepCount)));
}

function assertStep(grid: TabGrid, stepIndex: number): void {
  if (stepIndex < 0 || stepIndex >= grid.stepCount) {
    throw new Error(`Step ${stepIndex} is outside the grid.`);
  }
}
