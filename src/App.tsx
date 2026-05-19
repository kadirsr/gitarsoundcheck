import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AUTO_EXTEND_STEP_COUNT,
  AUTO_EXTEND_THRESHOLD,
  EXAMPLE_TAB,
  EXAMPLE_TABS,
  GUITAR_STRINGS,
  MAX_STEP_COUNT
} from "./constants";
import { AsciiTabEditor } from "./components/AsciiTabEditor";
import { Header } from "./components/Header";
import { InteractiveGrid } from "./components/InteractiveGrid";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { PracticePanel } from "./components/PracticePanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { useAudioPitch } from "./hooks/useAudioPitch";
import { useMetronome } from "./hooks/useMetronome";
import {
  loadAudioDebugEnabled,
  logAudioDebugFrame,
  saveAudioDebugEnabled
} from "./lib/audioDebug";
import {
  clearGrid,
  gridFromAscii,
  removeStep,
  resizeGrid,
  setGridNote
} from "./lib/tabGrid";
import { parseTab } from "./lib/tabParser";
import { renderGridToAscii } from "./lib/tabRenderer";
import {
  advanceFlowByTime,
  createPracticeState,
  evaluatePitchFrame,
  startPractice
} from "./lib/practiceEngine";
import {
  DEFAULT_SETTINGS,
  loadDraft,
  loadSettings,
  saveDraft,
  saveSettings
} from "./lib/storage";
import type { GuitarString, PracticeMode, TabGrid, TolerancePreset } from "./types";

function extendGridIfNeeded(grid: TabGrid, stepIndex: number, fret: number | null) {
  if (fret === null || stepIndex < grid.stepCount - AUTO_EXTEND_THRESHOLD) {
    return grid;
  }

  return resizeGrid(grid, Math.min(MAX_STEP_COUNT, grid.stepCount + AUTO_EXTEND_STEP_COUNT));
}

function extendGridAfterLastStep(grid: TabGrid) {
  if (grid.stepCount >= MAX_STEP_COUNT) {
    return grid;
  }

  return resizeGrid(grid, Math.min(MAX_STEP_COUNT, grid.stepCount + AUTO_EXTEND_STEP_COUNT));
}

function App() {
  const [mode, setMode] = useState<"ascii" | "grid">("grid");
  const [draftTitle, setDraftTitle] = useState("Starter riff");
  const [tabText, setTabText] = useState(EXAMPLE_TAB);
  const [grid, setGrid] = useState(() => gridFromAscii(EXAMPLE_TAB));
  const [selectedExampleId, setSelectedExampleId] = useState(EXAMPLE_TABS[0].id);
  const [selectedCell, setSelectedCell] = useState<{
    stringName: GuitarString;
    stepIndex: number;
  } | null>(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [audioDebugEnabled, setAudioDebugEnabled] = useState(loadAudioDebugEnabled);
  const [practiceState, setPracticeState] = useState(() =>
    createPracticeState(DEFAULT_SETTINGS.bpm, DEFAULT_SETTINGS.practiceMode)
  );
  const [lastError, setLastError] = useState<string | null>(null);
  const lastAudioDebugLogRef = useRef(0);

  const parseResult = useMemo(() => parseTab(tabText), [tabText]);
  const { frame, status: audioStatus, start: startAudio, stop: stopAudio } = useAudioPitch(
    settings.microphoneSensitivity
  );

  useMetronome(settings.bpm, metronomeEnabled);

  const commitGrid = useCallback((nextGrid: TabGrid) => {
    setGrid(nextGrid);
    setTabText(renderGridToAscii(nextGrid));
  }, []);

  const updateGridNote = useCallback(
    (stringName: GuitarString, stepIndex: number, fret: number | null) => {
      try {
        const nextGrid = extendGridIfNeeded(
          setGridNote(grid, stringName, stepIndex, fret),
          stepIndex,
          fret
        );
        commitGrid(nextGrid);
        setLastError(null);
      } catch (error) {
        setLastError(error instanceof Error ? error.message : "Could not update grid.");
      }
    },
    [commitGrid, grid]
  );

  useEffect(() => {
    const draft = loadDraft();
    const storedSettings = loadSettings();
    setDraftTitle(draft.title);
    setTabText(draft.tabText);
    setGrid(draft.grid ?? gridFromAscii(draft.tabText));
    setSettings(storedSettings);
    setPracticeState(createPracticeState(storedSettings.bpm, storedSettings.practiceMode));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      saveDraft(draftTitle, tabText, grid);
      saveSettings(settings);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [draftTitle, grid, settings, tabText]);

  useEffect(() => {
    if (!frame) {
      return;
    }

    setPracticeState((current) =>
      evaluatePitchFrame(current, parseResult.notes, frame, settings.tolerance)
    );
  }, [frame, parseResult.notes, settings.tolerance]);

  useEffect(() => {
    if (!audioDebugEnabled || !frame || practiceState.status !== "listening") {
      return;
    }

    if (frame.timestamp - lastAudioDebugLogRef.current < 300) {
      return;
    }

    lastAudioDebugLogRef.current = frame.timestamp;
    logAudioDebugFrame({
      frame,
      notes: parseResult.notes,
      practiceState,
      tolerance: settings.tolerance
    });
  }, [audioDebugEnabled, frame, parseResult.notes, practiceState, settings.tolerance]);

  useEffect(() => {
    if (practiceState.status !== "listening" || practiceState.mode !== "FLOW") {
      return;
    }

    const interval = window.setInterval(() => {
      setPracticeState((current) => advanceFlowByTime(current, parseResult.notes));
    }, 50);

    return () => window.clearInterval(interval);
  }, [parseResult.notes, practiceState.mode, practiceState.status]);

  useEffect(() => {
    if (practiceState.status === "completed") {
      stopAudio();
    }
  }, [practiceState.status, stopAudio]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!selectedCell || mode !== "grid") {
        return;
      }

      const { stringName, stepIndex } = selectedCell;
      const stringIndex = GUITAR_STRINGS.findIndex((string) => string.name === stringName);

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        updateGridNote(stringName, stepIndex, null);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (stepIndex >= grid.stepCount - 1) {
          const nextGrid = extendGridAfterLastStep(grid);
          commitGrid(nextGrid);
          setSelectedCell({
            stringName,
            stepIndex: Math.min(nextGrid.stepCount - 1, stepIndex + 1)
          });
          return;
        }

        setSelectedCell({ stringName, stepIndex: stepIndex + 1 });
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedCell({ stringName, stepIndex: Math.max(0, stepIndex - 1) });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedCell({
          stringName: GUITAR_STRINGS[Math.max(0, stringIndex - 1)].name,
          stepIndex
        });
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedCell({
          stringName: GUITAR_STRINGS[Math.min(GUITAR_STRINGS.length - 1, stringIndex + 1)].name,
          stepIndex
        });
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        const current = grid.cells[stringName][stepIndex];
        const nextText = current === null ? event.key : `${current}${event.key}`;
        const nextFret = Number.parseInt(nextText, 10);
        updateGridNote(stringName, stepIndex, nextFret);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commitGrid, grid, mode, selectedCell, updateGridNote]);

  const noteStepBySequence = useMemo(() => {
    const map = new Map<number, number>();
    parseResult.notes.forEach((note) => {
      map.set(note.sequenceIndex, Math.floor(note.columnIndex / 3));
    });
    return map;
  }, [parseResult.notes]);

  const correctSteps = useMemo(() => {
    const steps = new Set<number>();
    parseResult.notes.forEach((note) => {
      if (!practiceState.correctSequenceIndices.includes(note.sequenceIndex)) {
        return;
      }

      const step = noteStepBySequence.get(note.sequenceIndex);
      if (step !== undefined) {
        steps.add(step);
      }
    });
    return steps;
  }, [noteStepBySequence, parseResult.notes, practiceState.correctSequenceIndices]);

  const wrongSteps = useMemo(() => {
    const steps = new Set<number>();
    practiceState.recentMistakes.forEach((mistake) => {
      if (practiceState.correctSequenceIndices.includes(mistake.sequenceIndex)) {
        return;
      }

      const step = noteStepBySequence.get(mistake.sequenceIndex);
      if (step !== undefined) {
        steps.add(step);
      }
    });
    return steps;
  }, [noteStepBySequence, practiceState.correctSequenceIndices, practiceState.recentMistakes]);

  const currentStep =
    practiceState.mode === "FLOW" && practiceState.status === "listening"
      ? practiceState.currentStep
      : noteStepBySequence.get(practiceState.currentIndex) ?? null;

  function handleAsciiChange(nextText: string) {
    setTabText(nextText);
    const result = parseTab(nextText);
    if (result.warnings.length === 0) {
      setGrid(gridFromAscii(nextText));
    }
  }

  function handleResize(stepCount: number) {
    const nextGrid = resizeGrid(grid, stepCount);
    commitGrid(nextGrid);
  }

  function handleLoadExample(exampleId = selectedExampleId) {
    const example = EXAMPLE_TABS.find((item) => item.id === exampleId) ?? EXAMPLE_TABS[0];
    const nextGrid = gridFromAscii(example.tabText);
    setDraftTitle(example.title);
    setSelectedExampleId(example.id);
    setTabText(example.tabText);
    setGrid(nextGrid);
    setPracticeState(createPracticeState(settings.bpm, settings.practiceMode));
  }

  async function handleStart() {
    if (parseResult.notes.length === 0) {
      setLastError("Add at least one note before starting practice.");
      return;
    }

    if (!window.isSecureContext) {
      setLastError(
        "Mikrofonla pratik için bu HTTP adresi yerine http://localhost:8093 adresini aç. SSH tüneli üzerinden aynı sunucu uygulaması güvenli localhost olarak çalışır."
      );
      window.scrollTo({ left: 0, top: window.scrollY });
      return;
    }

    setPracticeState((current) => startPractice(current));
    await startAudio();
    window.scrollTo({ left: 0, top: window.scrollY });
  }

  function handleStop() {
    stopAudio();
    setPracticeState((current) => ({ ...current, status: "paused", stableSince: null }));
  }

  function updateSettings(next: Partial<typeof settings>) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    setPracticeState((current) => ({
      ...current,
      bpm: merged.bpm,
      mode: merged.practiceMode
    }));
  }

  function updateAudioDebug(enabled: boolean) {
    setAudioDebugEnabled(enabled);
    saveAudioDebugEnabled(enabled);
    if (enabled) {
      console.info(
        "[TabFlow audio] Debug enabled. Start practice and watch grouped logs. Recent frames stay in window.__TABFLOW_AUDIO_DEBUG__."
      );
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-5 overflow-x-hidden px-4 py-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          <section className="workspace-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-64 flex-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="tab-title">
                  Sekme başlığı
                </label>
                <input
                  className="control-input mt-1 w-full"
                  id="tab-title"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              </div>
              <ModeSwitcher mode={mode} onChange={setMode} />
              <label className="min-w-48 text-sm font-medium text-slate-700">
                Örnekler
                <select
                  className="control-input mt-1 w-full"
                  value={selectedExampleId}
                  onChange={(event) => handleLoadExample(event.target.value)}
                >
                  {EXAMPLE_TABS.map((example) => (
                    <option key={example.id} value={example.id}>
                      {example.title} · {example.mood}
                    </option>
                  ))}
                </select>
              </label>
              <button className="secondary-button" type="button" onClick={() => handleLoadExample()}>
                Örnek yükle
              </button>
            </div>
          </section>

          {lastError ? (
            <p className="rounded-md border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-50 shadow-lg shadow-black/10">
              {lastError}
            </p>
          ) : null}

          {audioStatus === "blocked" ? (
            <p className="rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-amber-100">
              Mikrofon izni engellendi. Otomatik nota algılama için tarayıcıdan mikrofon erişimine izin ver.
            </p>
          ) : null}

          {audioStatus === "insecure" ? (
            <p className="rounded-md border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-900">
              Bu adres HTTP. Mikrofon testi için aynı uygulamayı tünel üzerinden <strong>http://localhost:8093</strong> adresinde aç.
            </p>
          ) : null}

          {mode === "ascii" ? (
            <AsciiTabEditor
              onChange={handleAsciiChange}
              value={tabText}
              warnings={parseResult.warnings}
            />
          ) : (
            <InteractiveGrid
              correctSteps={correctSteps}
              currentStep={currentStep}
              grid={grid}
              onAddStep={() => {
                const nextGrid = resizeGrid(grid, grid.stepCount + AUTO_EXTEND_STEP_COUNT);
                commitGrid(nextGrid);
              }}
              onClear={() => {
                const nextGrid = clearGrid(grid);
                commitGrid(nextGrid);
              }}
              onRemoveStep={() => {
                const nextGrid = removeStep(grid);
                commitGrid(nextGrid);
              }}
              onResize={handleResize}
              onSelectCell={(stringName, stepIndex) => setSelectedCell({ stringName, stepIndex })}
              onSetNote={updateGridNote}
              selectedCell={selectedCell}
              wrongSteps={wrongSteps}
            />
          )}
          <ResultsPanel state={practiceState} totalNotes={parseResult.notes.length} />
        </div>
        <PracticePanel
          bpm={settings.bpm}
          audioStatus={audioStatus}
          metronomeEnabled={metronomeEnabled}
          mode={settings.practiceMode}
          notes={parseResult.notes}
          onBpmChange={(bpm) => updateSettings({ bpm })}
          onMetronomeChange={setMetronomeEnabled}
          onModeChange={(practiceMode: PracticeMode) => updateSettings({ practiceMode })}
          onReset={() => setPracticeState(createPracticeState(settings.bpm, settings.practiceMode))}
          onStart={handleStart}
          onStop={handleStop}
          onAudioDebugChange={updateAudioDebug}
          onToleranceChange={(tolerance: TolerancePreset) => updateSettings({ tolerance })}
          audioDebugEnabled={audioDebugEnabled}
          pitchFrame={frame}
          practiceState={practiceState}
          tolerance={settings.tolerance}
        />
      </main>
    </div>
  );
}

export default App;
