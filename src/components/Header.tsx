import { Music2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-line bg-ink/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-action text-ink">
            <Music2 size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">TabFlow</h1>
            <p className="text-sm text-slate-400">
              Write a tab, play the next note, keep the flow.
            </p>
          </div>
        </div>
        <p className="hidden text-sm text-slate-400 md:block">
          Audio is processed locally in your browser.
        </p>
      </div>
    </header>
  );
}
