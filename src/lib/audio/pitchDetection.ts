import { MIN_RMS } from "../../constants";
import type { PitchFrame, PitchTarget } from "../../types";
import {
  centsOffFromMidi,
  frequencyToMidi,
  midiToNoteName
} from "../../utils/noteUtils";

const MIN_GUITAR_FREQUENCY = 70;
const MAX_GUITAR_FREQUENCY = 1400;
const YIN_THRESHOLD = 0.18;
const YIN_FALLBACK_THRESHOLD = 0.35;
const MPM_CLARITY_THRESHOLD = 0.45;
const TARGET_SCORE_THRESHOLD = 2.4;

export function createPitchFrame(
  buffer: Float32Array,
  sampleRate: number,
  timestamp = performance.now(),
  minRms = MIN_RMS,
  options: {
    frequencyData?: Float32Array;
    fftSize?: number;
    target?: PitchTarget | null;
  } = {}
): PitchFrame {
  const rms = calculateRms(buffer);
  if (rms < minRms) {
    return emptyPitchFrame(rms, timestamp, {
      inputThreshold: minRms,
      rejectionReason: "rms-low"
    });
  }

  const targetResult =
    options.frequencyData && options.fftSize && options.target
      ? detectTargetFrequency(
          options.frequencyData,
          sampleRate,
          options.fftSize,
          options.target.frequency
        )
      : null;

  if (targetResult?.matched && options.target) {
    return {
      frequency: options.target.frequency,
      midi: options.target.midi,
      noteName: midiToNoteName(options.target.midi),
      centsOff: 0,
      rms,
      confidence: Math.max(0, Math.min(1, targetResult.score / 8)),
      timestamp,
      detectionMethod: "target",
      inputThreshold: minRms,
      targetScore: targetResult.score,
      targetRatio: targetResult.harmonicHits
    };
  }

  const pitchResult = detectPitch(buffer, sampleRate);
  const frequency = pitchResult?.frequency ?? null;
  if (frequency === null) {
    return emptyPitchFrame(rms, timestamp, {
      inputThreshold: minRms,
      rejectionReason: "no-lock",
      targetScore: targetResult?.score,
      targetRatio: targetResult?.harmonicHits
    });
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
    timestamp,
    detectionMethod: pitchResult?.method ?? "none",
    inputThreshold: minRms,
    targetScore: targetResult?.score,
    targetRatio: targetResult?.harmonicHits
  };
}

export function calculateRms(buffer: Float32Array): number {
  let sum = 0;
  for (const sample of buffer) {
    sum += sample * sample;
  }
  return Math.sqrt(sum / buffer.length);
}

function detectPitch(
  buffer: Float32Array,
  sampleRate: number
): { frequency: number; method: "yin" | "mpm" } | null {
  const normalized = removeDcOffset(buffer);
  const clipped = centerClip(normalized);
  const tauMin = Math.max(2, Math.floor(sampleRate / MAX_GUITAR_FREQUENCY));
  const tauMax = Math.min(
    normalized.length - 2,
    Math.ceil(sampleRate / MIN_GUITAR_FREQUENCY)
  );
  const yinFrequency = detectPitchWithYin(clipped, sampleRate, tauMin, tauMax);
  if (yinFrequency !== null) {
    return { frequency: yinFrequency, method: "yin" };
  }

  const mpmFrequency = detectPitchWithMpm(clipped, sampleRate, tauMin, tauMax);
  return mpmFrequency === null ? null : { frequency: mpmFrequency, method: "mpm" };
}

function detectPitchWithYin(
  buffer: Float32Array,
  sampleRate: number,
  tauMin: number,
  tauMax: number
): number | null {
  const difference = new Float32Array(tauMax + 1);

  for (let tau = 1; tau <= tauMax; tau += 1) {
    let sum = 0;
    for (let index = 0; index < buffer.length - tau; index += 1) {
      const delta = buffer[index] - buffer[index + tau];
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

function centerClip(buffer: Float32Array): Float32Array {
  let peak = 0;
  for (const sample of buffer) {
    peak = Math.max(peak, Math.abs(sample));
  }

  const threshold = peak * 0.12;
  if (threshold === 0) {
    return buffer;
  }

  return Float32Array.from(buffer, (sample) => {
    if (sample > threshold) {
      return sample - threshold;
    }
    if (sample < -threshold) {
      return sample + threshold;
    }
    return 0;
  });
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

function detectPitchWithMpm(
  buffer: Float32Array,
  sampleRate: number,
  tauMin: number,
  tauMax: number
): number | null {
  let bestTau = -1;
  let bestClarity = 0;

  for (let tau = tauMin; tau <= tauMax; tau += 1) {
    let acf = 0;
    let divisor = 0;

    for (let index = 0; index < buffer.length - tau; index += 1) {
      const current = buffer[index];
      const shifted = buffer[index + tau];
      acf += current * shifted;
      divisor += current * current + shifted * shifted;
    }

    if (divisor === 0) {
      continue;
    }

    const clarity = (2 * acf) / divisor;
    if (clarity > bestClarity) {
      bestClarity = clarity;
      bestTau = tau;
    }
  }

  if (bestTau === -1 || bestClarity < MPM_CLARITY_THRESHOLD) {
    return null;
  }

  const correctedTau = correctOctave(buffer, bestTau, bestClarity, tauMin);
  const frequency = sampleRate / correctedTau;

  if (frequency < MIN_GUITAR_FREQUENCY || frequency > MAX_GUITAR_FREQUENCY) {
    return null;
  }

  return frequency;
}

function correctOctave(
  buffer: Float32Array,
  tau: number,
  clarity: number,
  tauMin: number
): number {
  let correctedTau = tau;

  for (let divisor = 2; divisor <= 4; divisor += 1) {
    const candidateTau = Math.round(tau / divisor);
    if (candidateTau < tauMin) {
      continue;
    }

    const candidateClarity = calculateNsdfAtTau(buffer, candidateTau);
    if (candidateClarity >= clarity * 0.86) {
      correctedTau = candidateTau;
    }
  }

  return correctedTau;
}

function calculateNsdfAtTau(buffer: Float32Array, tau: number): number {
  let acf = 0;
  let divisor = 0;

  for (let index = 0; index < buffer.length - tau; index += 1) {
    const current = buffer[index];
    const shifted = buffer[index + tau];
    acf += current * shifted;
    divisor += current * current + shifted * shifted;
  }

  return divisor === 0 ? 0 : (2 * acf) / divisor;
}

function detectTargetFrequency(
  frequencyData: Float32Array,
  sampleRate: number,
  fftSize: number,
  targetFrequency: number
): { harmonicHits: number; matched: boolean; score: number } {
  const harmonicScores: number[] = [];

  for (let harmonic = 1; harmonic <= 6; harmonic += 1) {
    const frequency = targetFrequency * harmonic;
    if (frequency > sampleRate / 2) {
      break;
    }

    const bin = Math.round((frequency * fftSize) / sampleRate);
    const signal = maxLinearEnergy(frequencyData, bin, 2);
    const noise = averageNeighborEnergy(frequencyData, bin, 10, 2);
    const ratio = signal / Math.max(noise, 1e-12);
    harmonicScores.push(ratio);
  }

  const weightedScore =
    harmonicScores.reduce((sum, ratio, index) => sum + ratio / (index + 1), 0) /
    Math.max(1, harmonicScores.length);
  const harmonicHits = harmonicScores.filter((ratio) => ratio >= TARGET_SCORE_THRESHOLD).length;
  const matched =
    harmonicHits >= 2 ||
    harmonicScores[0] >= TARGET_SCORE_THRESHOLD * 1.4 ||
    weightedScore >= TARGET_SCORE_THRESHOLD * 1.2;

  return { harmonicHits, matched, score: weightedScore };
}

function maxLinearEnergy(data: Float32Array, centerBin: number, radius: number): number {
  let maxEnergy = 0;
  const start = Math.max(0, centerBin - radius);
  const end = Math.min(data.length - 1, centerBin + radius);

  for (let index = start; index <= end; index += 1) {
    maxEnergy = Math.max(maxEnergy, dbToLinearEnergy(data[index]));
  }

  return maxEnergy;
}

function averageNeighborEnergy(
  data: Float32Array,
  centerBin: number,
  radius: number,
  excludeRadius: number
): number {
  let sum = 0;
  let count = 0;
  const start = Math.max(0, centerBin - radius);
  const end = Math.min(data.length - 1, centerBin + radius);

  for (let index = start; index <= end; index += 1) {
    if (Math.abs(index - centerBin) <= excludeRadius) {
      continue;
    }

    sum += dbToLinearEnergy(data[index]);
    count += 1;
  }

  return count === 0 ? 1e-12 : sum / count;
}

function dbToLinearEnergy(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.pow(10, value / 10);
}

function emptyPitchFrame(
  rms: number,
  timestamp: number,
  diagnostics: Pick<
    PitchFrame,
    "inputThreshold" | "rejectionReason" | "targetRatio" | "targetScore"
  > = {}
): PitchFrame {
  return {
    frequency: null,
    midi: null,
    noteName: null,
    centsOff: null,
    rms,
    confidence: 0,
    timestamp,
    detectionMethod: "none",
    ...diagnostics
  };
}
