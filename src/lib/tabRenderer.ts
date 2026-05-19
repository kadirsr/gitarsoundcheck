import { GUITAR_STRINGS, STEP_WIDTH } from "../constants";
import type { TabGrid } from "../types";

export function renderGridToAscii(grid: TabGrid): string {
  return GUITAR_STRINGS.map((string) => {
    const tokens = grid.cells[string.name]
      .map((fret, stepIndex) => {
        const marker = grid.measureMarkers.includes(stepIndex) ? "|" : "";
        return `${marker}${renderStep(fret)}`;
      })
      .join("");

    return `${string.label}|${tokens}|`;
  }).join("\n");
}

function renderStep(fret: number | null): string {
  if (fret === null) {
    return "-".repeat(STEP_WIDTH);
  }

  const text = String(fret);
  return `${text}${"-".repeat(Math.max(0, STEP_WIDTH - text.length))}`;
}
