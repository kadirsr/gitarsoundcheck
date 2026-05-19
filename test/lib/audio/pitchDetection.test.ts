import { describe, expect, it } from "vitest";
import { createPitchFrame } from "../../../src/lib/audio/pitchDetection";

const SAMPLE_RATE = 44100;

describe("pitchDetection", () => {
  it("detects a fretted D-string G note", () => {
    const frame = createPitchFrame(createSineWave(196, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
    expect(frame.peak).toBeGreaterThan(0.3);
    expect(Math.abs(frame.centsOff ?? 999)).toBeLessThan(20);
  });

  it("detects low guitar fundamentals without falling below guitar range", () => {
    const frame = createPitchFrame(createSineWave(82.41, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("E2");
    expect(frame.midi).toBe(40);
  });

  it("detects a noisy harmonic-rich electric guitar style signal", () => {
    const frame = createPitchFrame(createGuitarLikeWave(196, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
  });

  it("accepts the expected note from spectral harmonic energy", () => {
    const frame = createPitchFrame(createNoise(8192), SAMPLE_RATE, 0, 0.001, {
      fftSize: 8192,
      frequencyData: createTargetSpectrum(196, 8192),
      target: { frequency: 196, midi: 55 }
    });

    expect(frame.detectionMethod).toBe("target");
    expect(frame.noteName).toBe("G3");
    expect(frame.midi).toBe(55);
  });

  it("keeps analysing quiet guitar input when it is above the lowered threshold", () => {
    const frame = createPitchFrame(createNoise(8192, 0.0008), SAMPLE_RATE, 0, 0.0005, {
      fftSize: 8192,
      frequencyData: createTargetSpectrum(146.83, 8192),
      target: { frequency: 146.83, midi: 50 }
    });

    expect(frame.detectionMethod).toBe("target");
    expect(frame.noteName).toBe("D3");
    expect(frame.inputThreshold).toBe(0.0005);
  });

  it("reports when audio is below the microphone input threshold", () => {
    const frame = createPitchFrame(createNoise(4096, 0.0001), SAMPLE_RATE, 0, 0.0005);

    expect(frame.frequency).toBeNull();
    expect(frame.rejectionReason).toBe("rms-low");
    expect(frame.inputThreshold).toBe(0.0005);
    expect(frame.peak).toBeGreaterThan(0);
  });

  it("ignores sub-guitar frequencies that caused false low-note locks", () => {
    const frame = createPitchFrame(createSineWave(46.25, 4096), SAMPLE_RATE, 0, 0.001);

    expect(frame.frequency).toBeNull();
    expect(frame.midi).toBeNull();
  });
});

function createSineWave(frequency: number, length: number): Float32Array {
  return Float32Array.from({ length }, (_, index) =>
    Math.sin((2 * Math.PI * frequency * index) / SAMPLE_RATE) * 0.4
  );
}

function createGuitarLikeWave(frequency: number, length: number): Float32Array {
  return Float32Array.from({ length }, (_, index) => {
    const time = index / SAMPLE_RATE;
    const envelope = Math.exp(-time * 5);
    const fundamental = Math.sin(2 * Math.PI * frequency * time) * 0.15;
    const second = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.3;
    const third = Math.sin(2 * Math.PI * frequency * 3 * time) * 0.18;
    const noise = Math.sin(2 * Math.PI * 37 * time) * 0.015;

    return (fundamental + second + third + noise) * envelope;
  });
}

function createNoise(length: number, amplitude = 0.02): Float32Array {
  return Float32Array.from({ length }, (_, index) =>
    Math.sin(index * 1.37) * amplitude
  );
}

function createTargetSpectrum(frequency: number, fftSize: number): Float32Array {
  const data = new Float32Array(fftSize / 2).fill(-95);

  for (let harmonic = 1; harmonic <= 5; harmonic += 1) {
    const bin = Math.round((frequency * harmonic * fftSize) / SAMPLE_RATE);
    data[bin] = -28 - harmonic * 2;
    data[bin - 1] = -36;
    data[bin + 1] = -36;
  }

  return data;
}
