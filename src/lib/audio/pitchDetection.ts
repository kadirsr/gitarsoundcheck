import { MIN_RMS } from "../../constants";
import type { PitchFrame } from "../../types";
import {
  centsOffFromMidi,
  frequencyToMidi,
  midiToNoteName
} from "../../utils/noteUtils";

export function createPitchFrame(
  buffer: Float32Array,
  sampleRate: number,
  timestamp = performance.now(),
  minRms = MIN_RMS
): PitchFrame {
  const rms = calculateRms(buffer);
  if (rms < minRms) {
    return emptyPitchFrame(rms, timestamp);
  }

  const frequency = autoCorrelate(buffer, sampleRate);
  if (frequency === null) {
    return emptyPitchFrame(rms, timestamp);
  }

  const midi = frequencyToMidi(frequency);
  const centsOff = centsOffFromMidi(frequency, midi);

  return {
    frequency,
    midi,
    noteName: midiToNoteName(midi),
    centsOff,
    rms,
    confidence: Math.max(0, Math.min(1, rms * 20)),
    timestamp
  };
}

export function calculateRms(buffer: Float32Array): number {
  let sum = 0;
  for (const sample of buffer) {
    sum += sample * sample;
  }
  return Math.sqrt(sum / buffer.length);
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
  const size = buffer.length;
  let bestOffset = -1;
  let bestCorrelation = 0;
  let previousCorrelation = 1;
  const correlations = new Array<number>(size).fill(0);

  for (let offset = 8; offset < size / 2; offset += 1) {
    let correlation = 0;

    for (let index = 0; index < size / 2; index += 1) {
      correlation += Math.abs(buffer[index] - buffer[index + offset]);
    }

    correlation = 1 - correlation / (size / 2);
    correlations[offset] = correlation;

    if (
      correlation > 0.9 &&
      correlation > previousCorrelation &&
      correlation > bestCorrelation
    ) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }

    previousCorrelation = correlation;
  }

  if (bestOffset === -1) {
    return null;
  }

  const shift =
    (correlations[bestOffset + 1] - correlations[bestOffset - 1]) /
    correlations[bestOffset];
  return sampleRate / (bestOffset + 8 * shift);
}

function emptyPitchFrame(rms: number, timestamp: number): PitchFrame {
  return {
    frequency: null,
    midi: null,
    noteName: null,
    centsOff: null,
    rms,
    confidence: 0,
    timestamp
  };
}
