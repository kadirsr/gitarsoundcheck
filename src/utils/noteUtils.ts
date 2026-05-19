import { GUITAR_STRINGS } from "../constants";
import type { GuitarString } from "../types";

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function frequencyToMidi(frequency: number): number {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${octave}`;
}

export function noteClassName(midi: number): string {
  return NOTE_NAMES[((midi % 12) + 12) % 12];
}

export function centsOffFromMidi(frequency: number, midi: number): number {
  return Math.round(1200 * Math.log2(frequency / midiToFrequency(midi)));
}

export function getOpenStringMidi(stringName: GuitarString): number {
  const guitarString = GUITAR_STRINGS.find((string) => string.name === stringName);
  if (!guitarString) {
    throw new Error(`Unknown guitar string: ${stringName}`);
  }
  return guitarString.midi;
}

export function getFrettedMidi(stringName: GuitarString, fret: number): number {
  return getOpenStringMidi(stringName) + fret;
}

export function describeFrettedNote(stringName: GuitarString, fret: number) {
  const midi = getFrettedMidi(stringName, fret);
  return {
    midi,
    noteName: noteClassName(midi),
    fullNoteName: midiToNoteName(midi),
    frequency: midiToFrequency(midi)
  };
}
