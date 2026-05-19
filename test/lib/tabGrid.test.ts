import { describe, expect, it } from "vitest";
import {
  addStep,
  createEmptyGrid,
  gridFromAscii,
  removeStep,
  setGridNote
} from "../../src/lib/tabGrid";
import { renderGridToAscii } from "../../src/lib/tabRenderer";

describe("tabGrid", () => {
  it("adds a note to a cell", () => {
    const grid = setGridNote(createEmptyGrid(8), "D", 0, 2);
    expect(grid.cells.D[0]).toBe(2);
  });

  it("clears the previous note in the same step", () => {
    let grid = setGridNote(createEmptyGrid(8), "D", 0, 2);
    grid = setGridNote(grid, "G", 0, 4);
    expect(grid.cells.D[0]).toBeNull();
    expect(grid.cells.G[0]).toBe(4);
  });

  it("adds and removes steps", () => {
    let grid = createEmptyGrid(8);
    grid = addStep(grid);
    expect(grid.stepCount).toBe(9);
    grid = removeStep(grid);
    expect(grid.stepCount).toBe(8);
  });

  it("round-trips grid through ASCII", () => {
    let grid = createEmptyGrid(8);
    grid = setGridNote(grid, "D", 0, 0);
    grid = setGridNote(grid, "G", 2, 12);
    const nextGrid = gridFromAscii(renderGridToAscii(grid));
    expect(nextGrid.cells.D[0]).toBe(0);
    expect(nextGrid.cells.G[2]).toBe(12);
  });
});
