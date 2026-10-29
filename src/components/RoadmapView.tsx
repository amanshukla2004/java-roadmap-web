import { useMemo } from "react";
import { matchesFilters } from "../lib/filters";
import { phases, roadmap } from "../lib/roadmap";
import type { ProgressApi } from "../hooks/useProgress";
import type { Filters } from "../types";
import { FilterBar } from "./FilterBar";
import { PhaseNav } from "./PhaseNav";
import { TopicRow } from "./TopicRow";

interface RoadmapViewProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  getStatus: ProgressApi["getStatus"];
  setStatus: ProgressApi["setStatus"];
  isWatched: ProgressApi["isWatched"];
  setWatched: ProgressApi["setWatched"];
}

export function RoadmapView({ filters, onFiltersChange, getStatus, setStatus, isWatched, setWatched }: RoadmapViewProps) {
  const groups = useMemo(
    () =>
      phases
        .map((phase) => ({
          phase,
          topics: phase.topics.filter((t) => matchesFilters(t, filters, getStatus(t.id))),
        }))
        .filter((group) => group.topics.length > 0),
    [filters, getStatus],
  );
  const shown = groups.reduce((n, g) => n + g.topics.length, 0);
  const total = filters.phase
    ? (phases.find((p) => p.name === filters.phase)?.topics.length ?? 0)
    : roadmap.topics.length;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:w-60 lg:shrink-0 lg:self-start lg:overflow-y-auto">
        <PhaseNav
          selected={filters.phase}
          onSelect={(phase) => {
            onFiltersChange({ ...filters, phase });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          getStatus={getStatus}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <FilterBar filters={filters} onChange={onFiltersChange} shown={shown} total={total} />

        {groups.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
            No topics match these filters.
          </p>
        )}

        {groups.map(({ phase, topics }) => (
          <section key={phase.name} aria-labelledby={`phase-${phase.number}`}>
            <h2 id={`phase-${phase.number}`} className="mb-2 flex items-baseline gap-2 px-1">
              <span className="text-xs font-medium text-slate-400 tabular-nums">Phase {phase.number}</span>
              <span className="font-semibold">{phase.label}</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  status={getStatus(topic.id)}
                  setStatus={setStatus}
                  isWatched={isWatched}
                  setWatched={setWatched}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
