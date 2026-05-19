import { Eraser, Minus, Plus, Trash2 } from "lucide-react";
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
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Interactive grid</h2>
          <p className="text-sm text-slate-300">
            Click a cell, enter fret 0-24, and keep one note per step.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            Steps
            <input
              className="w-20 rounded border border-line bg-ink px-2 py-2 text-slate-50 outline-none focus:ring-2 focus:ring-action/50"
              min={MIN_STEP_COUNT}
              max={MAX_STEP_COUNT}
              type="number"
              value={grid.stepCount}
              onChange={(event) => onResize(Number(event.target.value))}
            />
          </label>
          <button className="icon-button" type="button" title="Add step" onClick={onAddStep}>
            <Plus size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" title="Remove step" onClick={onRemoveStep}>
            <Minus size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" title="Clear tab" onClick={onClear}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded border border-line bg-ink shadow-xl shadow-black/15">
        <div
          className="grid min-w-max"
          style={{
            gridTemplateColumns: `56px repeat(${grid.stepCount}, minmax(40px, 40px))`
          }}
        >
          <div className="sticky left-0 z-10 border-b border-r border-line bg-ink px-2 py-2 text-xs text-slate-300">
            Step
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
              grid={grid}
              key={string.name}
              onSelectCell={onSelectCell}
              onSetNote={onSetNote}
              selectedCell={selectedCell}
              stringName={string.name}
              stringLabel={string.label}
              wrongSteps={wrongSteps}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <Eraser size={14} aria-hidden="true" />
        Backspace/Delete clears the selected note. Arrow keys move the selection.
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
  onSelectCell: (stringName: GuitarString, stepIndex: number) => void;
  onSetNote: (stringName: GuitarString, stepIndex: number, fret: number | null) => void;
};

function Row({
  grid,
  stringName,
  stringLabel,
  currentStep,
  correctSteps,
  wrongSteps,
  selectedCell,
  onSelectCell,
  onSetNote
}: RowProps) {
  return (
    <>
      <div className="sticky left-0 z-10 border-r border-line bg-ink px-3 py-2 font-mono text-sm text-slate-200">
        {stringLabel}
      </div>
      {grid.cells[stringName].map((fret, stepIndex) => {
        const selected =
          selectedCell?.stringName === stringName && selectedCell.stepIndex === stepIndex;
        const statusClass = getCellStatusClass({
          hasNote: fret !== null,
          current: currentStep === stepIndex,
          correct: correctSteps.has(stepIndex),
          wrong: wrongSteps.has(stepIndex),
          playhead: currentStep === stepIndex,
          selected
        });

        return (
          <button
            className={`h-10 border-b border-r border-line font-mono text-sm transition ${statusClass}`}
            key={`${stringName}-${stepIndex}`}
            type="button"
            title={`${stringLabel} string step ${stepIndex + 1}`}
            onClick={() => {
              onSelectCell(stringName, stepIndex);
              const input = window.prompt("Fret 0-24. Leave empty to clear.", fret?.toString() ?? "");
              if (input === null) {
                return;
              }
              const trimmed = input.trim();
              if (trimmed === "") {
                onSetNote(stringName, stepIndex, null);
                return;
              }
              const nextFret = Number.parseInt(trimmed, 10);
              onSetNote(stringName, stepIndex, nextFret);
            }}
          >
            {fret ?? ""}
          </button>
        );
      })}
    </>
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
    return "bg-panel text-white ring-2 ring-action";
  }
  if (hasNote) {
    return "bg-slate-600 text-white hover:bg-slate-500";
  }
  if (playhead) {
    return "bg-sky-300/20 text-slate-200";
  }
  return "text-slate-400 hover:bg-panel";
}
