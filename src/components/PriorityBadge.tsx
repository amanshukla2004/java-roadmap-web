import type { Priority } from "../types";

const styles: Record<Priority, string> = {
  "★ Critical": "bg-amber-400 text-amber-950 dark:bg-amber-500",
  Important: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-200",
  "Good to know": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  // Only Critical stays visible on narrow screens to keep rows uncluttered.
  const responsive = priority === "★ Critical" ? "inline-block" : "hidden sm:inline-block";
  return (
    <span className={`${responsive} shrink-0 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${styles[priority]}`}>
      {priority}
    </span>
  );
}
