import { Check, Mic, MicOff, Play, RotateCcw, Square } from "lucide-react";
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
  audioStatus: string;
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
  audioStatus,
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
            <p className="text-xs uppercase text-slate-400">Current note</p>
            {currentNote ? (
              <>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {currentNote.stringLabel} string, fret {currentNote.fret}
                </p>
                <p className="text-sm text-slate-300">
                  Expected: {currentNote.expectedNoteName} · {currentNote.expectedFrequency.toFixed(1)} Hz
                </p>
              </>
            ) : (
              <p className="mt-1 text-lg text-slate-300">No note selected.</p>
            )}
          </div>
          <ProgressRail notes={notes} currentIndex={practiceState.currentIndex} />
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
        <AudioStatusMessage status={audioStatus} />
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

function ProgressRail({
  notes,
  currentIndex
}: {
  notes: ParsedNote[];
  currentIndex: number;
}) {
  const progress =
    notes.length === 0 ? 0 : Math.min(100, Math.round((currentIndex / notes.length) * 100));

  return (
    <div className="space-y-2">
      <div className="relative h-3 overflow-hidden rounded-full bg-ink ring-1 ring-line">
        <div className="h-full bg-action transition-all" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-0 h-full w-1 bg-sky-200 shadow-[0_0_12px_rgba(125,211,252,0.9)] transition-all"
          style={{ left: `calc(${progress}% - 2px)` }}
        />
      </div>
      <div className="flex gap-1">
        {notes.slice(0, 24).map((note, index) => (
          <div
            className={[
              "h-1.5 flex-1 rounded-full transition",
              index < currentIndex
                ? "bg-action"
                : index === currentIndex
                  ? "bg-sky-300"
                  : "bg-slate-500/60"
            ].join(" ")}
            key={note.id}
          />
        ))}
      </div>
    </div>
  );
}

function AudioStatusMessage({ status }: { status: string }) {
  if (status === "listening") {
    return (
      <p className="mb-3 flex items-center gap-2 rounded border border-action/40 bg-action/15 px-3 py-2 text-sm text-emerald-50">
        <Mic size={16} aria-hidden="true" />
        Microphone is listening.
      </p>
    );
  }

  if (status === "insecure") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Microphone permission needs localhost or HTTPS. This HTTP server preview can show the UI, but browser audio will not start here.
      </p>
    );
  }

  if (status === "blocked") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded border border-danger/50 bg-danger/15 px-3 py-2 text-sm text-red-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Microphone permission was blocked. Allow microphone access in the browser and start again.
      </p>
    );
  }

  if (status === "unavailable" || status === "error") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Microphone could not be started in this browser context.
      </p>
    );
  }

  return (
    <p className="mb-3 flex items-center gap-2 rounded border border-line bg-ink px-3 py-2 text-sm text-slate-300">
      <Mic size={16} aria-hidden="true" />
      Press Start to request microphone access.
    </p>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-ink px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-100">{value}</p>
    </div>
  );
}
