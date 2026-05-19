import {
  EXAMPLE_TAB,
  MAX_MICROPHONE_SENSITIVITY,
  MIN_MICROPHONE_SENSITIVITY,
  MIN_RMS
} from "../constants";
import type { PracticeMode, SavedTab, TabGrid, TolerancePreset } from "../types";

const DRAFT_KEY = "tabflow:draft";
const SETTINGS_KEY = "tabflow:settings";

export type StoredSettings = {
  audioInputDeviceId: string;
  bpm: number;
  practiceMode: PracticeMode;
  tolerance: TolerancePreset;
  microphoneSensitivity: number;
};

export const DEFAULT_SETTINGS: StoredSettings = {
  audioInputDeviceId: "",
  bpm: 60,
  practiceMode: "WAIT",
  tolerance: "NORMAL",
  microphoneSensitivity: MIN_RMS
};

export function loadDraft(): SavedTab {
  const fallback = createInitialDraft();
  const rawValue = window.localStorage.getItem(DRAFT_KEY);
  if (!rawValue) {
    return fallback;
  }

  try {
    return { ...fallback, ...JSON.parse(rawValue) };
  } catch {
    return fallback;
  }
}

export function saveDraft(title: string, tabText: string, grid: TabGrid): void {
  const now = new Date().toISOString();
  const current = loadDraft();
  const next: SavedTab = {
    id: current.id,
    title,
    tabText,
    grid,
    createdAt: current.createdAt,
    updatedAt: now
  };
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

export function loadSettings(): StoredSettings {
  const rawValue = window.localStorage.getItem(SETTINGS_KEY);
  if (!rawValue) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(rawValue) };
    return {
      ...parsed,
      audioInputDeviceId:
        typeof parsed.audioInputDeviceId === "string" ? parsed.audioInputDeviceId : "",
      practiceMode: parsed.practiceMode === "BPM_STRICT" ? "FLOW" : parsed.practiceMode,
      microphoneSensitivity: normalizeMicrophoneSensitivity(parsed.microphoneSensitivity)
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StoredSettings): void {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function normalizeMicrophoneSensitivity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_SETTINGS.microphoneSensitivity;
  }

  if (Math.abs(value - 0.01) < Number.EPSILON) {
    return DEFAULT_SETTINGS.microphoneSensitivity;
  }

  return Math.min(
    MAX_MICROPHONE_SENSITIVITY,
    Math.max(MIN_MICROPHONE_SENSITIVITY, value)
  );
}

function createInitialDraft(): SavedTab {
  const now = new Date().toISOString();
  return {
    id: "draft",
    title: "Starter riff",
    tabText: EXAMPLE_TAB,
    createdAt: now,
    updatedAt: now
  };
}
