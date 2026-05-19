type Props = {
  value: string;
  warnings: string[];
  onChange: (value: string) => void;
};

export function AsciiTabEditor({ value, warnings, onChange }: Props) {
  return (
    <section className="workspace-card space-y-3 p-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">ASCII sekme</h2>
        <p className="text-sm text-slate-600">
          Tek notalı gitar tabını yapıştır veya düzenle. Çift haneli perdeler desteklenir.
        </p>
      </div>
      <textarea
        className="min-h-72 w-full resize-y rounded-md border border-line bg-white/90 p-4 font-mono text-sm leading-7 text-slate-950 outline-none ring-action/50 transition focus:ring-2"
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
