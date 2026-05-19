type Props = {
  value: string;
  warnings: string[];
  onChange: (value: string) => void;
};

export function AsciiTabEditor({ value, warnings, onChange }: Props) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-white">ASCII tab</h2>
        <p className="text-sm text-slate-400">
          Paste or edit a single-note guitar tab. Multi-digit frets are supported.
        </p>
      </div>
      <textarea
        className="min-h-72 w-full resize-y rounded border border-line bg-ink p-4 font-mono text-sm leading-7 text-slate-100 outline-none ring-action/50 transition focus:ring-2"
        value={value}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />
      {warnings.map((warning) => (
        <p className="rounded border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-amber-100" key={warning}>
          {warning}
        </p>
      ))}
    </section>
  );
}
