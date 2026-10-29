import { STATUSES, type TopicStatus } from "../types";

const NEXT: Record<TopicStatus, TopicStatus> = {
  "not-started": "in-progress",
  "in-progress": "done",
  done: "not-started",
};

const label = (status: TopicStatus) => STATUSES.find((s) => s.value === status)!.label;

function StatusIcon({ status }: { status: TopicStatus }) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 text-emerald-500">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "in-progress") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 text-indigo-500">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={2} />
        <path d="M12 6a6 6 0 0 1 0 12z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 text-slate-300 dark:text-slate-600">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

interface StatusButtonProps {
  status: TopicStatus;
  topicName: string;
  onChange: (status: TopicStatus) => void;
}

/** One-click status: Not started → In progress → Done → Not started. */
export function StatusButton({ status, topicName, onChange }: StatusButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(NEXT[status])}
      aria-label={`${topicName}: ${label(status)}. Change to ${label(NEXT[status])}`}
      title={`${label(status)} — click for ${label(NEXT[status])}`}
      className="grid size-8 shrink-0 place-items-center rounded-full outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800"
    >
      <StatusIcon status={status} />
    </button>
  );
}

interface StatusPickerProps {
  status: TopicStatus;
  name: string;
  onChange: (status: TopicStatus) => void;
}

/** Segmented radio group showing all three statuses. */
export function StatusPicker({ status, name, onChange }: StatusPickerProps) {
  return (
    <fieldset>
      <legend className="sr-only">Status</legend>
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
        {STATUSES.map((s) => (
          <label
            key={s.value}
            className="cursor-pointer rounded-md px-3 py-1 text-sm text-slate-600 has-checked:bg-white has-checked:font-medium has-checked:text-slate-900 has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-indigo-500 dark:text-slate-400 dark:has-checked:bg-slate-950 dark:has-checked:text-white"
          >
            <input
              type="radio"
              name={name}
              value={s.value}
              checked={status === s.value}
              onChange={() => onChange(s.value)}
              className="sr-only"
            />
            {s.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
