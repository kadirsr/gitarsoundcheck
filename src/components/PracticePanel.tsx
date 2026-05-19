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
    <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
      <section className="workspace-card overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Pratik</h2>
            <p className="text-xs text-slate-400">Sıradaki hedef ve performans</p>
          </div>
          <span className="rounded-md border border-line bg-ink/80 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
            {practiceState.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-line/70 bg-ink/85 p-4 shadow-inner shadow-black/15">
            <p className="text-xs uppercase tracking-wide text-slate-400">Güncel hedef</p>
            {currentNote ? (
              <>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  {currentNote.stringLabel} teli · {currentNote.fret}. perde
                </p>
                <p className="text-sm text-slate-300">
                  Beklenen: {currentNote.expectedNoteName} · {currentNote.expectedFrequency.toFixed(1)} Hz
                </p>
              </>
            ) : (
              <p className="mt-1 text-lg text-slate-300">Seçili nota yok.</p>
            )}
          </div>

          <ProgressRail notes={notes} currentIndex={practiceState.currentIndex} />

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="Nota" value={notes.length} tone="sky" />
            <Metric label="Doğru" value={practiceState.correctCount} tone="good" />
            <Metric label="Yanlış" value={practiceState.wrongCount} tone="bad" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="primary-button" type="button" onClick={onStart}>
            <Play size={16} aria-hidden="true" />
            Başlat
          </button>
          <button className="secondary-button" type="button" onClick={onStop}>
            <Square size={16} aria-hidden="true" />
            Dur
          </button>
          <button className="secondary-button" type="button" onClick={onManualCorrect}>
            <Check size={16} aria-hidden="true" />
            Doğru işaretle
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Sıfırla
          </button>
        </div>
      </section>

      <section className="workspace-card p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">Kontroller</h2>
        <div className="space-y-3">
          <label className="block text-sm text-slate-300">
            BPM
            <input
              className="control-input mt-1 w-full"
              max={240}
              min={30}
              type="number"
              value={bpm}
              onChange={(event) => onBpmChange(Number(event.target.value))}
            />
          </label>

          <label className="block text-sm text-slate-300">
            Mod
            <select
              className="control-input mt-1 w-full"
              value={mode}
              onChange={(event) => onModeChange(event.target.value as PracticeMode)}
            >
              <option value="WAIT">Bekleme modu</option>
              <option value="BPM_STRICT">BPM strict</option>
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            Hoşgörü
            <select
              className="control-input mt-1 w-full"
              value={tolerance}
              onChange={(event) => onToleranceChange(event.target.value as TolerancePreset)}
            >
              <option value="EASY">Kolay ±50 sent</option>
              <option value="NORMAL">Normal ±35 sent</option>
              <option value="STRICT">Sıkı ±20 sent</option>
            </select>
          </label>

          <label className="flex items-center justify-between rounded-md border border-line bg-ink/80 px-3 py-2 text-sm text-slate-300">
            Metronom
            <input
              checked={metronomeEnabled}
              type="checkbox"
              onChange={(event) => onMetronomeChange(event.target.checked)}
            />
          </label>
        </div>
      </section>

      <section className="workspace-card p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">Ses</h2>
        <AudioStatusMessage status={audioStatus} />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric label="Tespit" value={pitchFrame?.noteName ?? "-"} />
          <Metric label="Sent" value={pitchFrame?.centsOff ?? "-"} />
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
      <p className="mb-3 flex items-center gap-2 rounded-md border border-action/40 bg-action/15 px-3 py-2 text-sm text-emerald-50">
        <Mic size={16} aria-hidden="true" />
        Mikrofon dinliyor.
      </p>
    );
  }

  if (status === "insecure") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded-md border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Mikrofon için localhost veya HTTPS gerekir. Bu HTTP önizleme arayüzü gösterir; ses burada başlamaz.
      </p>
    );
  }

  if (status === "blocked") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded-md border border-danger/50 bg-danger/15 px-3 py-2 text-sm text-red-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Mikrofon izni engellendi. Tarayıcıdan izin verip tekrar başlat.
      </p>
    );
  }

  if (status === "unavailable" || status === "error") {
    return (
      <p className="mb-3 flex items-start gap-2 rounded-md border border-warn/50 bg-warn/15 px-3 py-2 text-sm text-amber-50">
        <MicOff className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
        Bu tarayıcı bağlamında mikrofon başlatılamadı.
      </p>
    );
  }

  return (
    <p className="mb-3 flex items-center gap-2 rounded-md border border-line bg-ink/80 px-3 py-2 text-sm text-slate-300">
      <Mic size={16} aria-hidden="true" />
      Mikrofon erişimini istemek için Başlat'a bas.
    </p>
  );
}

function Metric({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "good" | "bad" | "sky";
}) {
  const toneClass = {
    neutral: "border-line bg-ink/80",
    good: "border-emerald-300/30 bg-emerald-300/10",
    bad: "border-red-300/30 bg-red-300/10",
    sky: "border-sky-300/30 bg-sky-300/10"
  }[tone];

  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-100">{value}</p>
    </div>
  );
}
