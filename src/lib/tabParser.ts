import { GUITAR_STRINGS } from "../constants";
import type { ParseResult, ParsedNote } from "../types";
import { describeFrettedNote } from "../utils/noteUtils";

const CHORD_WARNING =
  "This tab contains more than one note at the same time. MVP supports single-note practice only.";

export function parseTab(tabText: string): ParseResult {
  const lines = tabText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const noteCandidates: Array<Omit<ParsedNote, "sequenceIndex">> = [];
  const warnings: string[] = [];

  for (const line of lines) {
    const parsedLine = parseTabLine(line);
    if (!parsedLine) {
      continue;
    }

    const { stringName, stringLabel, content } = parsedLine;
    let columnIndex = 0;

    while (columnIndex < content.length) {
      const character = content[columnIndex];

      if (/\d/.test(character)) {
        let fretText = character;
        let nextColumn = columnIndex + 1;

        while (nextColumn < content.length && /\d/.test(content[nextColumn])) {
          fretText += content[nextColumn];
          nextColumn += 1;
        }

        const fret = Number.parseInt(fretText, 10);
        if (Number.isInteger(fret) && fret >= 0) {
          const note = describeFrettedNote(stringName, fret);
          noteCandidates.push({
            id: `${stringName}-${columnIndex}-${fret}`,
            stringName,
            stringLabel,
            fret,
            columnIndex,
            expectedNoteName: note.noteName,
            expectedMidi: note.midi,
            expectedFrequency: note.frequency
          });
        }

        columnIndex = nextColumn;
        continue;
      }

      columnIndex += 1;
    }
  }

  const chordColumns = new Map<number, number>();
  for (const note of noteCandidates) {
    chordColumns.set(note.columnIndex, (chordColumns.get(note.columnIndex) ?? 0) + 1);
  }

  if ([...chordColumns.values()].some((count) => count > 1)) {
    warnings.push(CHORD_WARNING);
  }

  const notes = noteCandidates
    .sort((left, right) => {
      if (left.columnIndex !== right.columnIndex) {
        return left.columnIndex - right.columnIndex;
      }
      return stringOrder(left.stringName) - stringOrder(right.stringName);
    })
    .map((note, sequenceIndex) => ({
      ...note,
      sequenceIndex
    }));

  return { notes, warnings };
}

function parseTabLine(line: string) {
  const pipeIndex = line.indexOf("|");
  if (pipeIndex <= 0) {
    return null;
  }

  const rawLabel = line.slice(0, pipeIndex).trim();
  const content = line.slice(pipeIndex + 1);
  const match = GUITAR_STRINGS.find(
    (string) =>
      string.label === rawLabel ||
      (rawLabel === "e" && string.name === "E_HIGH") ||
      (rawLabel === "E" && string.name === "E_LOW")
  );

  if (!match) {
    return null;
  }

  return {
    stringName: match.name,
    stringLabel: match.label,
    content
  };
}

function stringOrder(stringName: string): number {
  return GUITAR_STRINGS.findIndex((string) => string.name === stringName);
}
