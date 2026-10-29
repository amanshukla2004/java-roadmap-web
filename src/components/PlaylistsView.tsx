import { useState } from "react";
import { formatHours, playlistVideos, roadmap, videoId, type PlaylistVideo } from "../lib/roadmap";
import type { ProgressApi } from "../hooks/useProgress";
import type { Playlist, PlaylistKey } from "../types";
import { ExternalIcon, PlayIcon, SearchIcon } from "./Icons";
import { ProgressBar } from "./ProgressBar";
import { VideoItem } from "./VideoItem";

interface PlaylistsViewProps {
  isWatched: ProgressApi["isWatched"];
  setWatched: ProgressApi["setWatched"];
}

type Show = "all" | "unwatched" | "watched";

function PlaylistPicker({
  playlist,
  selected,
  isWatched,
  onSelect,
}: {
  playlist: Playlist;
  selected: boolean;
  isWatched: ProgressApi["isWatched"];
  onSelect: () => void;
}) {
  const videos = playlistVideos[playlist.key];
  const watched = videos.filter((v) => isWatched(videoId(playlist.key, v.pos)));
  const total = videos.reduce((s, v) => s + v.minutes, 0);
  const watchedMinutes = watched.reduce((s, v) => s + v.minutes, 0);
  const topics = roadmap.topics.filter((t) => t.videos[playlist.key].length > 0).length;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex flex-col gap-3 rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        selected
          ? "border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-400 dark:border-indigo-600 dark:bg-indigo-950/40 dark:ring-indigo-600"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold">{playlist.channel}</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{playlist.name}</span>
      </span>
      <span className="flex items-baseline justify-between text-sm">
        <span>
          <span className="text-xl font-semibold tabular-nums">{watched.length}</span>
          <span className="text-slate-400"> / {videos.length} videos</span>
        </span>
        <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
          {formatHours(watchedMinutes)} / {formatHours(total)}
        </span>
      </span>
      <ProgressBar label={`${playlist.channel} videos watched`} value={watched.length} max={videos.length} barClassName="bg-indigo-500" />
      <span className="text-xs text-slate-500 dark:text-slate-400">Covers {topics} roadmap topics</span>
    </button>
  );
}

function UpNext({ video, onMarkWatched }: { video: PlaylistVideo; onMarkWatched: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-indigo-600 p-4 text-white sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-indigo-200 uppercase">Up next</p>
        <p className="mt-0.5 font-medium">
          <span className="text-indigo-200 tabular-nums">#{video.pos}</span> {video.title}
        </p>
        <p className="text-xs text-indigo-200">{video.duration}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 outline-none hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
        >
          <PlayIcon className="size-3.5" /> Watch
        </a>
        <button
          type="button"
          onClick={onMarkWatched}
          className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium outline-none hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-white"
        >
          Mark watched
        </button>
      </div>
    </div>
  );
}

export function PlaylistsView({ isWatched, setWatched }: PlaylistsViewProps) {
  const [selectedKey, setSelectedKey] = useState<PlaylistKey>(roadmap.playlists[0].key);
  const [show, setShow] = useState<Show>("all");
  const [search, setSearch] = useState("");

  const playlist = roadmap.playlists.find((p) => p.key === selectedKey)!;
  const videos = playlistVideos[selectedKey];
  const watchedOf = (v: PlaylistVideo) => isWatched(videoId(selectedKey, v.pos));
  const watchedCount = videos.filter(watchedOf).length;
  const upNext = videos.find((v) => !watchedOf(v));
  const query = search.trim().toLowerCase();
  const listed = videos.filter(
    (v) =>
      (show === "all" || (show === "watched") === watchedOf(v)) &&
      (!query || v.title.toLowerCase().includes(query)),
  );

  const counts: Record<Show, number> = {
    all: videos.length,
    unwatched: videos.length - watchedCount,
    watched: watchedCount,
  };
  const showLabels: Record<Show, string> = { all: "All", unwatched: "To watch", watched: "Watched" };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {roadmap.playlists.map((p) => (
          <PlaylistPicker
            key={p.key}
            playlist={p}
            selected={p.key === selectedKey}
            isWatched={isWatched}
            onSelect={() => setSelectedKey(p.key)}
          />
        ))}
      </div>

      <section aria-labelledby="playlist-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="playlist-heading" className="text-lg font-semibold">
              {playlist.channel}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{playlist.name}</p>
          </div>
          <a
            href={playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded text-sm font-medium text-indigo-600 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400"
          >
            Open on YouTube <ExternalIcon className="size-3.5" />
          </a>
        </div>

        {upNext ? (
          <UpNext video={upNext} onMarkWatched={() => setWatched(videoId(selectedKey, upNext.pos), true)} />
        ) : (
          <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            🎉 You've watched every video in this playlist.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div role="radiogroup" aria-label="Show videos" className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {(Object.keys(showLabels) as Show[]).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={show === value}
                onClick={() => setShow(value)}
                className={`rounded-md px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  show === value
                    ? "bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {showLabels[value]} <span className="text-xs text-slate-400 tabular-nums">{counts[value]}</span>
              </button>
            ))}
          </div>
          <div className="relative min-w-48 flex-1">
            <label htmlFor="video-search" className="sr-only">
              Search videos in this playlist
            </label>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="video-search"
              type="search"
              placeholder="Search videos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {listed.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
            No videos here.
          </p>
        ) : (
          <ul className="flex flex-col rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
            {listed.map((video) => {
              const id = videoId(selectedKey, video.pos);
              return (
                <VideoItem
                  key={id}
                  video={video}
                  watched={isWatched(id)}
                  onWatchedChange={(value) => setWatched(id, value)}
                >
                  <span className="mt-1 flex flex-wrap gap-1">
                    {video.topics.map((t) => (
                      <span
                        key={t.id}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {t.topic}
                      </span>
                    ))}
                  </span>
                </VideoItem>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
