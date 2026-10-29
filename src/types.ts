export const PLAYLIST_KEYS = ["A", "B", "C", "D", "E"] as const;
export type PlaylistKey = (typeof PLAYLIST_KEYS)[number];

export type Priority = "★ Critical" | "Important" | "Good to know";
export const PRIORITIES: Priority[] = ["★ Critical", "Important", "Good to know"];

export interface Playlist {
  key: PlaylistKey;
  channel: string;
  name: string;
  url: string;
  videoCount: number;
}

export interface Video {
  pos: number;
  title: string;
  duration: string;
  minutes: number;
  url: string;
}

export interface Topic {
  id: number;
  phase: string;
  topic: string;
  subtopics: string;
  priority: Priority;
  gapNote: string;
  videos: Record<PlaylistKey, Video[]>;
}

export interface Roadmap {
  playlists: Playlist[];
  topics: Topic[];
}

export type TopicStatus = "not-started" | "in-progress" | "done";
export const STATUSES: { value: TopicStatus; label: string }[] = [
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export interface Progress {
  topicStatus: Record<string, TopicStatus>;
  watched: Record<string, boolean>;
}

export interface Filters {
  search: string;
  priority: Priority | "";
  phase: string;
  status: TopicStatus | "";
  playlist: PlaylistKey | "";
  gapsOnly: boolean;
  criticalOnly: boolean;
}
