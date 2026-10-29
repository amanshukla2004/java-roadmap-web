import { formatHours, playlistVideos, roadmap, totalMinutes, videoId } from "../lib/roadmap";
import type { ProgressApi } from "../hooks/useProgress";
import { PLAYLIST_KEYS } from "../types";
import { ProgressBar } from "./ProgressBar";

interface OverallStatsProps {
  getStatus: ProgressApi["getStatus"];
  isWatched: ProgressApi["isWatched"];
}

interface StatProps {
  label: string;
  value: string;
  total: string;
  current: number;
  max: number;
  barClassName: string;
}

function Stat({ label, value, total, current, max, barClassName }: StatProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">
        {value}
        <span className="text-base font-normal text-slate-400"> / {total}</span>
      </p>
      <ProgressBar label={label} value={current} max={max} barClassName={barClassName} />
    </div>
  );
}

export function OverallStats({ getStatus, isWatched }: OverallStatsProps) {
  const topics = roadmap.topics;
  const done = topics.filter((t) => getStatus(t.id) === "done").length;
  const critical = topics.filter((t) => t.priority === "★ Critical");
  const criticalDone = critical.filter((t) => getStatus(t.id) === "done").length;
  const watchedMinutes = PLAYLIST_KEYS.reduce(
    (sum, key) =>
      sum + playlistVideos[key].filter((v) => isWatched(videoId(key, v.pos))).reduce((s, v) => s + v.minutes, 0),
    0,
  );

  return (
    <section aria-label="Overall progress" className="grid gap-3 sm:grid-cols-3">
      <Stat
        label="Topics done"
        value={String(done)}
        total={String(topics.length)}
        current={done}
        max={topics.length}
        barClassName="bg-emerald-500"
      />
      <Stat
        label="★ Critical done"
        value={String(criticalDone)}
        total={String(critical.length)}
        current={criticalDone}
        max={critical.length}
        barClassName="bg-amber-500"
      />
      <Stat
        label="Hours watched"
        value={formatHours(watchedMinutes)}
        total={formatHours(totalMinutes)}
        current={Math.round(watchedMinutes)}
        max={Math.round(totalMinutes)}
        barClassName="bg-indigo-500"
      />
    </section>
  );
}
