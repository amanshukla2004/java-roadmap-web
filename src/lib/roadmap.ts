import data from "../data/roadmap.json";
import { PLAYLIST_KEYS, type PlaylistKey, type Roadmap, type Topic, type Video } from "../types";

/** Playlists left out of this build, e.g. VITE_EXCLUDE_PLAYLISTS=B,E (see .env.lite). */
const excluded = new Set(
  (import.meta.env.VITE_EXCLUDE_PLAYLISTS ?? "")
    .split(",")
    .map((k) => k.trim().toUpperCase())
    .filter(Boolean),
);

/** Excluded playlists are dropped and their videos emptied, so every view treats them as absent. */
export const roadmap: Roadmap = (() => {
  const full = data as Roadmap;
  if (excluded.size === 0) return full;
  return {
    playlists: full.playlists.filter((p) => !excluded.has(p.key)),
    topics: full.topics.map((t) => ({
      ...t,
      videos: Object.fromEntries(
        PLAYLIST_KEYS.map((k) => [k, excluded.has(k) ? [] : t.videos[k]]),
      ) as Topic["videos"],
    })),
  };
})();

export interface Phase {
  name: string;
  number: number;
  label: string;
  topics: Topic[];
}

/** "3 · Exceptions" -> { number: 3, label: "Exceptions" } */
function parsePhase(name: string): { number: number; label: string } {
  const match = name.match(/^(\d+)\s*·\s*(.+)$/);
  return match ? { number: Number(match[1]), label: match[2] } : { number: 0, label: name };
}

export const phases: Phase[] = (() => {
  const byName = new Map<string, Phase>();
  for (const topic of roadmap.topics) {
    let phase = byName.get(topic.phase);
    if (!phase) {
      phase = { name: topic.phase, ...parsePhase(topic.phase), topics: [] };
      byName.set(topic.phase, phase);
    }
    phase.topics.push(topic);
  }
  return [...byName.values()].sort((a, b) => a.number - b.number);
})();

export const videoId = (key: PlaylistKey, pos: number) => `${key}-${pos}`;

export function hasVideos(topic: Topic) {
  return PLAYLIST_KEYS.some((key) => topic.videos[key].length > 0);
}

export function isPartial(topic: Topic) {
  return topic.gapNote.startsWith("Partial");
}

export interface PlaylistVideo extends Video {
  /** Roadmap topics this video is mapped to. */
  topics: Topic[];
}

/** Every distinct video in a playlist, in playlist order (videos can map to several topics). */
export const playlistVideos: Record<PlaylistKey, PlaylistVideo[]> = (() => {
  const result = Object.fromEntries(PLAYLIST_KEYS.map((k) => [k, new Map<number, PlaylistVideo>()]));
  for (const topic of roadmap.topics) {
    for (const key of PLAYLIST_KEYS) {
      for (const video of topic.videos[key]) {
        let entry = result[key].get(video.pos);
        if (!entry) {
          entry = { ...video, topics: [] };
          result[key].set(video.pos, entry);
        }
        entry.topics.push(topic);
      }
    }
  }
  return Object.fromEntries(
    PLAYLIST_KEYS.map((k) => [k, [...result[k].values()].sort((a, b) => a.pos - b.pos)]),
  ) as Record<PlaylistKey, PlaylistVideo[]>;
})();

export const totalMinutes = PLAYLIST_KEYS.reduce(
  (sum, key) => sum + playlistVideos[key].reduce((s, v) => s + v.minutes, 0),
  0,
);

/**
 * Search queries from a gap note, e.g.
 * "NOT COVERED — Search: java regex tutorial; java lookahead" -> ["java regex tutorial", "java lookahead"].
 * Falls back to the topic name when the note has no "Search:" part.
 */
export function searchQueries(topic: Topic): string[] {
  const match = topic.gapNote.match(/Search:\s*(.+)$/i);
  if (!match) return [`java ${topic.topic}`];
  return match[1]
    .split(";")
    .map((q) => q.replace(/\(.*?\)/g, "").trim())
    .filter(Boolean);
}

export const youtubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export function formatHours(minutes: number) {
  return `${(minutes / 60).toFixed(1)} h`;
}
