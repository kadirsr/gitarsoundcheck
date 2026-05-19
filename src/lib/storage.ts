import { EXAMPLE_TAB } from "../constants";
import type { PracticeMode, SavedTab, TabGrid, TolerancePreset } from "../types";

const DRAFT_KEY = "tabflow:draft";
const SETTINGS_KEY = "tabflow:settings";

export type StoredSettings = {
  bpm: number;
  practiceMode: PracticeMode;
  tolerance: TolerancePreset;
  microphoneSensitivity: number;
};

export const DEFAULT_SETTINGS: StoredSettings = {
  bpm: 60,
  practiceMode: "WAIT",
  tolerance: "NORMAL",
  microphoneSensitivity: 0.01
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
    return { ...DEFAULT_SETTINGS, ...JSON.parse(rawValue) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StoredSettings): void {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
