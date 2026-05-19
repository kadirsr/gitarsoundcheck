import { MIN_RMS } from "../../constants";
import type { PitchFrame } from "../../types";
import {
  centsOffFromMidi,
  frequencyToMidi,
  midiToNoteName
} from "../../utils/noteUtils";

const MIN_GUITAR_FREQUENCY = 70;
const MAX_GUITAR_FREQUENCY = 1400;
const YIN_THRESHOLD = 0.18;
const YIN_FALLBACK_THRESHOLD = 0.35;

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

  const frequency = detectPitch(buffer, sampleRate);
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

function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const normalized = removeDcOffset(buffer);
  const tauMin = Math.max(2, Math.floor(sampleRate / MAX_GUITAR_FREQUENCY));
  const tauMax = Math.min(
    normalized.length - 2,
    Math.ceil(sampleRate / MIN_GUITAR_FREQUENCY)
  );
  const difference = new Float32Array(tauMax + 1);

  for (let tau = 1; tau <= tauMax; tau += 1) {
    let sum = 0;
    for (let index = 0; index < normalized.length - tau; index += 1) {
      const delta = normalized[index] - normalized[index + tau];
      sum += delta * delta;
    }
    difference[tau] = sum;
  }

  const cumulativeMeanNormalizedDifference = new Float32Array(tauMax + 1);
  cumulativeMeanNormalizedDifference[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau <= tauMax; tau += 1) {
    runningSum += difference[tau];
    cumulativeMeanNormalizedDifference[tau] =
      runningSum === 0 ? 1 : (difference[tau] * tau) / runningSum;
  }

  const tau = findBestTau(cumulativeMeanNormalizedDifference, tauMin, tauMax);
  if (tau === null) {
    return null;
  }

  const refinedTau = refineTau(cumulativeMeanNormalizedDifference, tau);
  const frequency = sampleRate / refinedTau;

  if (frequency < MIN_GUITAR_FREQUENCY || frequency > MAX_GUITAR_FREQUENCY) {
    return null;
  }

  return frequency;
}

function removeDcOffset(buffer: Float32Array): Float32Array {
  let mean = 0;
  for (const sample of buffer) {
    mean += sample;
  }
  mean /= buffer.length;

  return Float32Array.from(buffer, (sample) => sample - mean);
}

function findBestTau(
  cumulativeMeanNormalizedDifference: Float32Array,
  tauMin: number,
  tauMax: number
): number | null {
  let fallbackTau: number | null = null;
  let fallbackValue = Number.POSITIVE_INFINITY;

  for (let tau = tauMin; tau <= tauMax; tau += 1) {
    const value = cumulativeMeanNormalizedDifference[tau];
    if (value < fallbackValue) {
      fallbackValue = value;
      fallbackTau = tau;
    }

    if (value >= YIN_THRESHOLD) {
      continue;
    }

    while (
      tau + 1 <= tauMax &&
      cumulativeMeanNormalizedDifference[tau + 1] < value
    ) {
      tau += 1;
    }

    return tau;
  }

  return fallbackValue <= YIN_FALLBACK_THRESHOLD ? fallbackTau : null;
}

function refineTau(values: Float32Array, tau: number): number {
  const previous = values[tau - 1];
  const current = values[tau];
  const next = values[tau + 1];
  const divisor = previous + next - 2 * current;

  if (!Number.isFinite(divisor) || divisor === 0) {
    return tau;
  }

  return tau + (previous - next) / (2 * divisor);
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
