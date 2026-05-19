import { describe, expect, it } from "vitest";
import { createEmptyGrid, setGridNote } from "../../src/lib/tabGrid";
import { renderGridToAscii } from "../../src/lib/tabRenderer";

describe("tabRenderer", () => {
  it("renders a grid to ASCII tab", () => {
    let grid = createEmptyGrid(8);
    grid = setGridNote(grid, "D", 0, 0);
    grid = setGridNote(grid, "G", 2, 12);

    const ascii = renderGridToAscii(grid);
    expect(ascii).toContain("D|0--");
    expect(ascii).toContain("G|------12-");
  });
});
