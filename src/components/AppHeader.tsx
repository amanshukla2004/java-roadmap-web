import type { ProgressApi } from "../hooks/useProgress";
import type { View } from "../hooks/useHashView";
import { MoonIcon, SunIcon } from "./Icons";
import { MoreMenu } from "./MoreMenu";

interface AppHeaderProps {
  view: View;
  dark: boolean;
  onToggleDark: () => void;
  exportJson: ProgressApi["exportJson"];
  importJson: ProgressApi["importJson"];
  reset: ProgressApi["reset"];
}

const tabs: { view: View; label: string }[] = [
  { view: "roadmap", label: "Roadmap" },
  { view: "playlists", label: "Playlists" },
];

export function AppHeader({ view, dark, onToggleDark, exportJson, importJson, reset }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <span className="hidden truncate font-semibold sm:block">{import.meta.env.VITE_APP_TITLE}</span>
        <span className="font-semibold sm:hidden">☕ Java</span>
        <nav aria-label="Views" className="mx-auto flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800/70">
          {tabs.map((tab) => {
            const current = tab.view === view;
            return (
              <a
                key={tab.view}
                href={`#${tab.view}`}
                aria-current={current ? "page" : undefined}
                className={`rounded-md px-3 py-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  current
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleDark}
            className="grid size-9 place-items-center rounded-lg text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
          </button>
          <MoreMenu exportJson={exportJson} importJson={importJson} reset={reset} />
        </div>
      </div>
    </header>
  );
}
