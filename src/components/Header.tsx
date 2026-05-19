import { Activity, Music2, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-line/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-action text-white shadow-lg shadow-pink-900/20">
            <Music2 size={22} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">TabFlow</h1>
              <span className="rounded-full border border-action/40 bg-action/10 px-2 py-0.5 text-xs font-medium text-pink-700">
                Pop-Rock MVP
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Sekmeni oluştur, sıradaki notayı yakala, akışı koru.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-slate-700 md:flex">
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-white/80 px-3 py-2">
            <ShieldCheck size={15} aria-hidden="true" />
            Ses tarayıcıda kalır
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-white/80 px-3 py-2">
            <Activity size={15} aria-hidden="true" />
            Nota nota pratik
          </span>
        </div>
      </div>
    </header>
  );
}
