interface ProgressBarProps {
  /** Accessible name of the bar. */
  label: string;
  value: number;
  max: number;
  barClassName?: string;
  className?: string;
}

/** A thin bar; any visible text is rendered by the caller. */
export function ProgressBar({ label, value, max, barClassName = "bg-emerald-500", className = "h-1.5" }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} (${percent}%)`}
      className={`overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-300 ${barClassName}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
