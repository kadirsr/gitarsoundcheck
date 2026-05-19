import { describe, expect, it } from "vitest";
import { EXAMPLE_TAB } from "../../src/constants";
import { parseTab } from "../../src/lib/tabParser";

describe("tabParser", () => {
  it("parses a standard six-line tab", () => {
    const result = parseTab(EXAMPLE_TAB);
    expect(result.notes).toHaveLength(5);
    expect(result.notes[0]).toMatchObject({
      stringName: "D",
      fret: 0,
      expectedNoteName: "D"
    });
  });

  it("parses multi-digit frets as one note", () => {
    const result = parseTab(`e|---10---12---|
B|-------------|
G|-------------|
D|-------------|
A|-------------|
E|-------------|`);

    expect(result.notes.map((note) => note.fret)).toEqual([10, 12]);
  });

  it("ignores empty lines", () => {
    const result = parseTab(`\n${EXAMPLE_TAB}\n`);
    expect(result.notes).toHaveLength(5);
  });

  it("warns when a chord is found", () => {
    const result = parseTab(`e|---0---|
B|---1---|
G|-------|
D|-------|
A|-------|
E|-------|`);
    expect(result.warnings[0]).toContain("single-note");
  });

  it("orders notes by column", () => {
    const result = parseTab(EXAMPLE_TAB);
    expect(result.notes.map((note) => note.sequenceIndex)).toEqual([0, 1, 2, 3, 4]);
  });
});
