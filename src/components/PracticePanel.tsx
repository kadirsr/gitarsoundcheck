import { Check, Play, RotateCcw, Square } from "lucide-react";
import type {
  ParsedNote,
  PitchFrame,
  PracticeMode,
  PracticeState,
  TolerancePreset
} from "../types";

type Props = {
  notes: ParsedNote[];
  practiceState: PracticeState;
  pitchFrame: PitchFrame | null;
  tolerance: TolerancePreset;
  onToleranceChange: (tolerance: TolerancePreset) => void;
  bpm: number;
  mode: PracticeMode;
  metronomeEnabled: boolean;
  onBpmChange: (bpm: number) => void;
  onModeChange: (mode: PracticeMode) => void;
  onMetronomeChange: (enabled: boolean) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onManualCorrect: () => void;
};

export function PracticePanel({
  notes,
  practiceState,
  pitchFrame,
  tolerance,
  onToleranceChange,
  bpm,
  mode,
  metronomeEnabled,
  onBpmChange,
  onModeChange,
  onMetronomeChange,
  onStart,
  onStop,
  onReset,
  onManualCorrect
}: Props) {
  const currentNote = notes[practiceState.currentIndex] ?? null;
  const progress = notes.length === 0 ? 0 : Math.round((practiceState.currentIndex / notes.length) * 100);

  return (
    <aside className="space-y-4">
      <section className="rounded border border-line bg-panel p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Practice</h2>
          <span className="rounded bg-ink px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
            {practiceState.status}
          </span>
        </div>
        <div className="space-y-3">
          <div className="rounded bg-ink p-4">
            <p className="text-xs uppercase text-slate-500">Current note</p>
            {currentNote ? (
              <>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {currentNote.stringLabel} string, fret {currentNote.fret}
                </p>
                <p className="text-sm text-slate-400">
                  Expected: {currentNote.expectedNoteName} · {currentNote.expectedFrequency.toFixed(1)} Hz
                </p>
              </>
            ) : (
              <p className="mt-1 text-lg text-slate-300">No note selected.</p>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded bg-ink">
            <div className="h-full bg-action transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="Notes" value={notes.length} />
            <Metric label="Correct" value={practiceState.correctCount} />
            <Metric label="Wrong" value={practiceState.wrongCount} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="primary-button" type="button" onClick={onStart}>
            <Play size={16} aria-hidden="true" />
            Start
          </button>
          <button className="secondary-button" type="button" onClick={onStop}>
            <Square size={16} aria-hidden="true" />
            Stop
          </button>
          <button className="secondary-button" type="button" onClick={onManualCorrect}>
            <Check size={16} aria-hidden="true" />
            Mark correct
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>
      <section className="rounded border border-line bg-panel p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">Controls</h2>
        <div className="space-y-3">
          <label className="block text-sm text-slate-300">
            BPM
            <input
              className="mt-1 w-full rounded border border-line bg-ink px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-action/50"
              max={240}
              min={30}
              type="number"
              value={bpm}
              onChange={(event) => onBpmChange(Number(event.target.value))}
            />
          </label>
          <label className="block text-sm text-slate-300">
            Mode
            <select
              className="mt-1 w-full rounded border border-line bg-ink px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-action/50"
              value={mode}
              onChange={(event) => onModeChange(event.target.value as PracticeMode)}
            >
              <option value="WAIT">Wait Mode</option>
              <option value="BPM_STRICT">BPM Strict</option>
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Tolerance
            <select
              className="mt-1 w-full rounded border border-line bg-ink px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-action/50"
              value={tolerance}
              onChange={(event) => onToleranceChange(event.target.value as TolerancePreset)}
            >
              <option value="EASY">Easy ±50 cents</option>
              <option value="NORMAL">Normal ±35 cents</option>
              <option value="STRICT">Strict ±20 cents</option>
            </select>
          </label>
          <label className="flex items-center justify-between rounded border border-line bg-ink px-3 py-2 text-sm text-slate-300">
            Metronome
            <input
              checked={metronomeEnabled}
              type="checkbox"
              onChange={(event) => onMetronomeChange(event.target.checked)}
            />
          </label>
        </div>
      </section>
      <section className="rounded border border-line bg-panel p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">Audio</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric label="Detected" value={pitchFrame?.noteName ?? "-"} />
          <Metric label="Cents" value={pitchFrame?.centsOff ?? "-"} />
          <Metric label="Hz" value={pitchFrame?.frequency ? pitchFrame.frequency.toFixed(1) : "-"} />
          <Metric label="RMS" value={pitchFrame?.rms ? pitchFrame.rms.toFixed(3) : "0.000"} />
        </div>
      </section>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-ink px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-100">{value}</p>
    </div>
  );
}
