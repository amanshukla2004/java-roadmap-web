import { useId, useState, type KeyboardEvent } from "react";
import { roadmap, videoId } from "../lib/roadmap";
import type { ProgressApi } from "../hooks/useProgress";
import { PLAYLIST_KEYS, type PlaylistKey, type Topic } from "../types";
import { VideoItem } from "./VideoItem";

interface VideoTabsProps {
  topic: Topic;
  isWatched: ProgressApi["isWatched"];
  setWatched: ProgressApi["setWatched"];
}

const channelOf = (key: PlaylistKey) => roadmap.playlists.find((p) => p.key === key)!.channel;

export function VideoTabs({ topic, isWatched, setWatched }: VideoTabsProps) {
  const keys = PLAYLIST_KEYS.filter((k) => topic.videos[k].length > 0);
  const [active, setActive] = useState<PlaylistKey>(keys[0]);
  const baseId = useId();
  if (keys.length === 0) return null;

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent) => {
    const index = keys.indexOf(active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % keys.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + keys.length) % keys.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = keys.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(keys[next]);
    document.getElementById(`${baseId}-tab-${keys[next]}`)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Playlists"
        className="flex gap-4 overflow-x-auto border-b border-slate-200 dark:border-slate-800"
        onKeyDown={onKeyDown}
      >
        {keys.map((key) => {
          const selected = key === active;
          const watched = topic.videos[key].filter((v) => isWatched(videoId(key, v.pos))).length;
          return (
            <button
              key={key}
              id={`${baseId}-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(key)}
              className={`-mb-px shrink-0 border-b-2 px-0.5 pb-2 text-sm whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                selected
                  ? "border-indigo-500 font-medium text-slate-900 dark:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {channelOf(key)}{" "}
              <span className="text-xs text-slate-400 tabular-nums">
                {watched}/{topic.videos[key].length}
              </span>
            </button>
          );
        })}
      </div>
      <ul
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-2 flex flex-col"
      >
        {topic.videos[active].map((video) => {
          const id = videoId(active, video.pos);
          return (
            <VideoItem
              key={id}
              video={video}
              watched={isWatched(id)}
              onWatchedChange={(value) => setWatched(id, value)}
            />
          );
        })}
      </ul>
    </div>
  );
}
