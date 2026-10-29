import { memo, useState } from "react";
import { hasVideos, isPartial, videoId } from "../lib/roadmap";
import { PLAYLIST_KEYS, type Topic, type TopicStatus } from "../types";
import type { ProgressApi } from "../hooks/useProgress";
import { GapBanner } from "./GapBanner";
import { ChevronIcon, PlayIcon } from "./Icons";
import { PriorityBadge } from "./PriorityBadge";
import { StatusButton, StatusPicker } from "./StatusControls";
import { VideoTabs } from "./VideoTabs";

interface TopicRowProps {
  topic: Topic;
  status: TopicStatus;
  setStatus: ProgressApi["setStatus"];
  isWatched: ProgressApi["isWatched"];
  setWatched: ProgressApi["setWatched"];
}

/** A collapsed one-line topic that expands to show details and videos. */
export const TopicRow = memo(function TopicRow({ topic, status, setStatus, isWatched, setWatched }: TopicRowProps) {
  const [open, setOpen] = useState(false);
  const covered = hasVideos(topic);
  const videoIds = PLAYLIST_KEYS.flatMap((k) => topic.videos[k].map((v) => videoId(k, v.pos)));
  const watched = videoIds.filter(isWatched).length;
  const panelId = `topic-panel-${topic.id}`;
  const done = status === "done";

  return (
    <li
      className={`rounded-xl border bg-white transition-shadow dark:bg-slate-900 ${
        open ? "border-slate-300 shadow-sm dark:border-slate-700" : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex items-center gap-2 py-2 pr-2 pl-2 sm:pl-3">
        <StatusButton status={status} topicName={topic.topic} onChange={(s) => setStatus(topic.id, s)} />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="min-w-0 flex-1">
            <span
              className={`line-clamp-2 text-sm font-medium sm:text-[0.95rem] ${done ? "text-slate-400 dark:text-slate-500" : ""}`}
            >
              {topic.topic}
            </span>
          </span>
          <PriorityBadge priority={topic.priority} />
          {covered ? (
            <span
              className={`hidden shrink-0 items-center gap-1 text-xs tabular-nums sm:inline-flex ${
                watched === videoIds.length ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
              }`}
              title={`${watched} of ${videoIds.length} videos watched`}
            >
              <PlayIcon className="size-3" />
              {watched}/{videoIds.length}
            </span>
          ) : (
            <span className="hidden shrink-0 text-xs font-medium text-red-600 sm:inline dark:text-red-400">No videos</span>
          )}
          <ChevronIcon className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div id={panelId} className="flex flex-col gap-4 border-t border-slate-100 px-4 pt-3 pb-4 dark:border-slate-800">
          {topic.subtopics && <p className="text-sm text-slate-600 dark:text-slate-400">{topic.subtopics}</p>}
          <StatusPicker status={status} name={`status-${topic.id}`} onChange={(s) => setStatus(topic.id, s)} />
          {!covered && <GapBanner topic={topic} variant="missing" />}
          {covered && isPartial(topic) && <GapBanner topic={topic} variant="partial" />}
          <VideoTabs topic={topic} isWatched={isWatched} setWatched={setWatched} />
        </div>
      )}
    </li>
  );
});
