import { Eraser, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GUITAR_STRINGS, MAX_STEP_COUNT, MIN_STEP_COUNT } from "../constants";
import type { GuitarString, TabGrid } from "../types";

type Props = {
  grid: TabGrid;
  currentStep: number | null;
  correctSteps: Set<number>;
  wrongSteps: Set<number>;
  selectedCell: { stringName: GuitarString; stepIndex: number } | null;
  onSelectCell: (stringName: GuitarString, stepIndex: number) => void;
  onSetNote: (stringName: GuitarString, stepIndex: number, fret: number | null) => void;
  onAddStep: () => void;
  onRemoveStep: () => void;
  onResize: (stepCount: number) => void;
  onClear: () => void;
};

export function InteractiveGrid({
  grid,
  currentStep,
  correctSteps,
  wrongSteps,
  selectedCell,
  onSelectCell,
  onSetNote,
  onAddStep,
  onRemoveStep,
  onResize,
  onClear
}: Props) {
  const [editorCell, setEditorCell] = useState<{
    stringName: GuitarString;
    stepIndex: number;
  } | null>(null);
  const [draftFret, setDraftFret] = useState("");

  function openEditor(stringName: GuitarString, stepIndex: number, fret: number | null) {
    onSelectCell(stringName, stepIndex);
    setEditorCell({ stringName, stepIndex });
    setDraftFret(fret?.toString() ?? "");
  }

  function closeEditor() {
    setEditorCell(null);
    setDraftFret("");
  }

  function commitEditor() {
    if (!editorCell) {
      return;
    }

    const trimmed = draftFret.trim();
    onSetNote(
      editorCell.stringName,
      editorCell.stepIndex,
      trimmed === "" ? null : Number.parseInt(trimmed, 10)
    );
    closeEditor();
  }

  return (
    <section className="workspace-card space-y-4 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">Etkileşimli ızgara</h2>
            <span className="rounded-full border border-action/25 bg-action/10 px-2 py-0.5 text-xs font-medium text-action">
              Tek nota modu
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Hücre seç, perdeyi belirle; sona yaklaştıkça timeline otomatik uzar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Adımlar
            <input
              className="control-input w-20"
              min={MIN_STEP_COUNT}
              max={MAX_STEP_COUNT}
              type="number"
              value={grid.stepCount}
              onChange={(event) => onResize(Number(event.target.value))}
            />
          </label>
          <button className="icon-button" type="button" title="16 adım ekle" onClick={onAddStep}>
            <Plus size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" title="Adım sil" onClick={onRemoveStep}>
            <Minus size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" title="Sekmeyi temizle" onClick={onClear}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-line bg-ink/95 px-3 py-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Sekme oynatıcı</p>
          <p className="text-sm text-slate-300">
            Adım {currentStep === null ? "01" : String(currentStep + 1).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(grid.stepCount, 16) }, (_, index) => (
            <span
              className={[
                "h-1.5 w-5 rounded-full transition",
                currentStep === index
                  ? "bg-sky-300"
                  : index < (currentStep ?? 0)
                    ? "bg-action"
                    : "bg-slate-600"
              ].join(" ")}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="tab-player-viewport rounded-b-md border border-line bg-ink/95 shadow-xl shadow-black/20">
        <div
          className="grid min-w-max"
          style={{
            gridTemplateColumns: `64px repeat(${grid.stepCount}, minmax(44px, 44px))`
          }}
        >
          <div className="sticky left-0 z-20 border-b border-r border-line bg-ink px-3 py-2 text-xs text-slate-300">
            Adım
          </div>
          {Array.from({ length: grid.stepCount }, (_, index) => (
            <div
              className={`border-b border-line px-1 py-2 text-center text-xs ${
                currentStep === index ? "bg-sky-300 text-ink" : "text-slate-400"
              }`}
              key={index}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          ))}
          {GUITAR_STRINGS.map((string) => (
            <Row
              correctSteps={correctSteps}
              currentStep={currentStep}
              draftFret={draftFret}
              editorCell={editorCell}
              grid={grid}
              key={string.name}
              onCloseEditor={closeEditor}
              onCommitEditor={commitEditor}
              onDraftFretChange={setDraftFret}
              onOpenEditor={openEditor}
              selectedCell={selectedCell}
              stringName={string.name}
              stringLabel={string.label}
              wrongSteps={wrongSteps}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Eraser size={14} aria-hidden="true" />
        Backspace/Delete seçili notayı temizler. Ok tuşları seçimi taşır.
      </div>
    </section>
  );
}
type RowProps = {
  grid: TabGrid;
  stringName: GuitarString;
  stringLabel: string;
  currentStep: number | null;
  correctSteps: Set<number>;
  wrongSteps: Set<number>;
  selectedCell: { stringName: GuitarString; stepIndex: number } | null;
  editorCell: { stringName: GuitarString; stepIndex: number } | null;
  draftFret: string;
  onOpenEditor: (stringName: GuitarString, stepIndex: number, fret: number | null) => void;
  onDraftFretChange: (value: string) => void;
  onCommitEditor: () => void;
  onCloseEditor: () => void;
};

function Row({
  grid,
  stringName,
  stringLabel,
  currentStep,
  correctSteps,
  wrongSteps,
  selectedCell,
  editorCell,
  draftFret,
  onOpenEditor,
  onDraftFretChange,
  onCommitEditor,
  onCloseEditor
}: RowProps) {
  return (
    <>
      <div className="sticky left-0 z-20 border-r border-line bg-ink px-3 py-2 font-mono text-sm text-white">
        {stringLabel}
      </div>
      {grid.cells[stringName].map((fret, stepIndex) => {
        const selected =
          selectedCell?.stringName === stringName && selectedCell.stepIndex === stepIndex;
        const editing =
          editorCell?.stringName === stringName && editorCell.stepIndex === stepIndex;
        const statusClass = getCellStatusClass({
          hasNote: fret !== null,
          current: currentStep === stepIndex,
          correct: correctSteps.has(stepIndex),
          wrong: wrongSteps.has(stepIndex),
          playhead: currentStep === stepIndex,
          selected
        });

        return (
          <div className="relative h-11 border-b border-r border-line" key={`${stringName}-${stepIndex}`}>
            <button
              className={`h-full w-full font-mono text-sm transition ${statusClass}`}
              type="button"
              title={`${stringLabel} string step ${stepIndex + 1}`}
              onClick={() => onOpenEditor(stringName, stepIndex, fret)}
            >
              {fret ?? ""}
            </button>
            {editing ? (
              <FretPicker
                draftFret={draftFret}
                onChange={onDraftFretChange}
                onClose={onCloseEditor}
                onCommit={onCommitEditor}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
function FretPicker({
  draftFret,
  onChange,
  onCommit,
  onClose
}: {
  draftFret: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  onClose: () => void;
}) {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    selectRef.current?.focus();
  }, []);

  return (
    <div className="absolute left-1/2 top-full z-30 mt-2 w-44 -translate-x-1/2 rounded border border-line bg-panel p-2 shadow-2xl shadow-black/30">
      <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="fret-picker">
        Perde
      </label>
      <select
        className="control-input w-full text-sm"
        id="fret-picker"
        ref={selectRef}
        value={draftFret}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
      >
        <option value="">Temizle</option>
        {Array.from({ length: 25 }, (_, fret) => (
          <option key={fret} value={fret}>
            {fret}
          </option>
        ))}
      </select>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className="primary-button px-2 py-1.5 text-xs" type="button" onClick={onCommit}>
          Tamam
        </button>
        <button className="secondary-button px-2 py-1.5 text-xs" type="button" onClick={onClose}>
          İptal
        </button>
      </div>
    </div>
  );
}

function getCellStatusClass({
  hasNote,
  current,
  correct,
  wrong,
  playhead,
  selected
}: {
  hasNote: boolean;
  current: boolean;
  correct: boolean;
  wrong: boolean;
  playhead: boolean;
  selected: boolean;
}) {
  if (correct && hasNote) {
    return "bg-emerald-400 text-ink shadow-inner shadow-white/20";
  }
  if (wrong && hasNote) {
    return "bg-red-500 text-white shadow-inner shadow-white/20";
  }
  if (current && hasNote) {
    return "bg-sky-300 text-ink ring-2 ring-sky-100";
  }
  if (selected) {
    return "bg-action/20 text-white ring-2 ring-action";
  }
  if (hasNote) {
    return "bg-slate-600 text-white hover:bg-slate-500";
  }
  if (playhead) {
    return "bg-sky-300/20 text-slate-200";
  }
  return "text-slate-400 hover:bg-white/5";
}
