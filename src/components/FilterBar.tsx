import { useState, type ReactNode } from "react";
import { defaultFilters, isFiltering, panelFilterCount } from "../lib/filters";
import { roadmap } from "../lib/roadmap";
import { PRIORITIES, STATUSES, type Filters } from "../types";
import { FilterIcon, SearchIcon } from "./Icons";

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  shown: number;
  total: number;
}

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900";

const chipClass =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
  "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 " +
  "aria-pressed:border-indigo-300 aria-pressed:bg-indigo-50 aria-pressed:text-indigo-800 dark:aria-pressed:border-indigo-700 dark:aria-pressed:bg-indigo-950/60 dark:aria-pressed:text-indigo-200";

function SelectField({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FilterBar({ filters, onChange, shown, total }: FilterBarProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });
  const panelCount = panelFilterCount(filters);

  return (
    <section aria-label="Search and filters" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-48 flex-1">
          <label htmlFor="filter-search" className="sr-only">
            Search topics
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="filter-search"
            type="search"
            placeholder="Search topics…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <button
          type="button"
          aria-pressed={filters.criticalOnly}
          onClick={() => set("criticalOnly", !filters.criticalOnly)}
          className={chipClass}
        >
          ★ Critical
        </button>
        <button
          type="button"
          aria-pressed={filters.gapsOnly}
          onClick={() => set("gapsOnly", !filters.gapsOnly)}
          className={chipClass}
          title="Topics that no playlist (or only part of one) covers"
        >
          Gaps
        </button>
        <button
          type="button"
          aria-expanded={panelOpen}
          aria-controls="filter-panel"
          onClick={() => setPanelOpen(!panelOpen)}
          className={chipClass}
        >
          <FilterIcon />
          Filters
          {panelCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-indigo-600 text-xs text-white">
              {panelCount}
            </span>
          )}
        </button>
      </div>

      {panelOpen && (
        <div
          id="filter-panel"
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900"
        >
          <SelectField label="Priority" id="filter-priority">
            <select
              id="filter-priority"
              value={filters.priority}
              onChange={(e) => set("priority", e.target.value as Filters["priority"])}
              className={selectClass}
            >
              <option value="">Any priority</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </SelectField>
          <SelectField label="Status" id="filter-status">
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => set("status", e.target.value as Filters["status"])}
              className={selectClass}
            >
              <option value="">Any status</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </SelectField>
          <SelectField label="Covered by playlist" id="filter-playlist">
            <select
              id="filter-playlist"
              value={filters.playlist}
              onChange={(e) => set("playlist", e.target.value as Filters["playlist"])}
              className={selectClass}
            >
              <option value="">Any playlist</option>
              {roadmap.playlists.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.channel}
                </option>
              ))}
            </select>
          </SelectField>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span aria-live="polite">
          {shown === total ? `${total} topics` : `${shown} of ${total} topics`}
        </span>
        {isFiltering(filters) && (
          <button
            type="button"
            onClick={() => onChange({ ...defaultFilters, phase: filters.phase })}
            className="rounded font-medium text-indigo-600 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400"
          >
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
