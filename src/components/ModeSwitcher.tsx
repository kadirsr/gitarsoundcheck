import { Grid3X3, TextCursorInput } from "lucide-react";

type Props = {
  mode: "ascii" | "grid";
  onChange: (mode: "ascii" | "grid") => void;
};

export function ModeSwitcher({ mode, onChange }: Props) {
  return (
    <div className="inline-flex overflow-hidden rounded border border-line bg-ink p-1">
      <button
        className={buttonClass(mode === "ascii")}
        type="button"
        onClick={() => onChange("ascii")}
        title="ASCII editor"
      >
        <TextCursorInput size={16} aria-hidden="true" />
        ASCII
      </button>
      <button
        className={buttonClass(mode === "grid")}
        type="button"
        onClick={() => onChange("grid")}
        title="Interactive grid"
      >
        <Grid3X3 size={16} aria-hidden="true" />
        Grid
      </button>
    </div>
  );
}

function buttonClass(active: boolean) {
  return [
    "flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition",
    active ? "bg-action text-ink" : "text-slate-300 hover:bg-panel"
  ].join(" ");
}
