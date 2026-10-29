import type { ReactNode } from "react";
import type { Video } from "../types";

interface VideoItemProps {
  video: Video;
  watched: boolean;
  onWatchedChange: (watched: boolean) => void;
  /** Extra content under the title, e.g. the topics a video covers. */
  children?: ReactNode;
}

/** One video: watched checkbox, YouTube link (new tab), duration. */
export function VideoItem({ video, watched, onWatchedChange, children }: VideoItemProps) {
  return (
    <li className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <input
        type="checkbox"
        checked={watched}
        onChange={(e) => onWatchedChange(e.target.checked)}
        aria-label={`Watched: ${video.title}`}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-emerald-600"
      />
      <div className="min-w-0 flex-1">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded text-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            watched ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"
          }`}
        >
          <span className="mr-1 text-slate-400 tabular-nums">#{video.pos}</span>
          {video.title}
          <span className="sr-only"> (opens YouTube in a new tab)</span>
        </a>
        {children}
      </div>
      <span className="shrink-0 pt-0.5 text-xs text-slate-400 tabular-nums">{video.duration}</span>
    </li>
  );
}
