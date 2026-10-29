import { phases, roadmap } from "../lib/roadmap";
import type { ProgressApi } from "../hooks/useProgress";
import { ProgressBar } from "./ProgressBar";

interface PhaseNavProps {
  /** Selected phase name, or "" for all phases. */
  selected: string;
  onSelect: (phase: string) => void;
  getStatus: ProgressApi["getStatus"];
}

interface ItemProps {
  label: string;
  done: number;
  total: number;
  active: boolean;
  onClick: () => void;
}

function PhaseItem({ label, done, total, active, onClick }: ItemProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`w-44 shrink-0 rounded-lg px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:w-full ${
        active
          ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
      }`}
    >
      <span className="flex items-baseline justify-between gap-2 text-sm">
        <span className={`truncate ${active ? "font-semibold" : ""}`}>{label}</span>
        <span className="shrink-0 text-xs text-slate-500 tabular-nums dark:text-slate-400">
          {done}/{total}
        </span>
      </span>
      <ProgressBar label={`${label} progress`} value={done} max={total} className="mt-1.5 h-1" />
    </button>
  );
}

export function PhaseNav({ selected, onSelect, getStatus }: PhaseNavProps) {
  const doneIn = (topics: { id: number }[]) => topics.filter((t) => getStatus(t.id) === "done").length;
  return (
    <nav aria-label="Phases">
      <h2 className="mb-2 hidden px-3 text-xs font-medium tracking-wide text-slate-500 uppercase lg:block dark:text-slate-400">
        Phases
      </h2>
      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        <PhaseItem
          label="All phases"
          done={doneIn(roadmap.topics)}
          total={roadmap.topics.length}
          active={selected === ""}
          onClick={() => onSelect("")}
        />
        {phases.map((phase) => (
          <PhaseItem
            key={phase.name}
            label={`${phase.number}. ${phase.label}`}
            done={doneIn(phase.topics)}
            total={phase.topics.length}
            active={selected === phase.name}
            onClick={() => onSelect(phase.name)}
          />
        ))}
      </div>
    </nav>
  );
}
