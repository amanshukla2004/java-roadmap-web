import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { OverallStats } from "./components/OverallStats";
import { PlaylistsView } from "./components/PlaylistsView";
import { RoadmapView } from "./components/RoadmapView";
import { useDarkMode } from "./hooks/useDarkMode";
import { useHashView } from "./hooks/useHashView";
import { useProgress } from "./hooks/useProgress";
import { defaultFilters } from "./lib/filters";
import type { Filters } from "./types";

export default function App() {
  const { getStatus, setStatus, isWatched, setWatched, exportJson, importJson, reset } = useProgress();
  const [dark, setDark] = useDarkMode();
  const view = useHashView();
  // Kept here so filters survive switching between tabs.
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm dark:focus:bg-slate-900"
      >
        Skip to content
      </a>
      <AppHeader
        view={view}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        exportJson={exportJson}
        importJson={importJson}
        reset={reset}
      />
      <main id="main" className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <OverallStats getStatus={getStatus} isWatched={isWatched} />
        {view === "roadmap" ? (
          <RoadmapView
            filters={filters}
            onFiltersChange={setFilters}
            getStatus={getStatus}
            setStatus={setStatus}
            isWatched={isWatched}
            setWatched={setWatched}
          />
        ) : (
          <PlaylistsView isWatched={isWatched} setWatched={setWatched} />
        )}
      </main>
    </div>
  );
}
