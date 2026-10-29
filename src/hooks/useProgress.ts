import { useCallback, useEffect, useState } from "react";
import type { Progress, TopicStatus } from "../types";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const VALID_STATUSES: TopicStatus[] = ["not-started", "in-progress", "done"];

const emptyProgress = (): Progress => ({ topicStatus: {}, watched: {} });

/**
 * Validates untrusted progress data (localStorage or an imported file).
 * Unknown topic IDs / video keys are kept so progress survives roadmap.json changes;
 * only malformed values are dropped.
 */
export function parseProgress(raw: unknown): Progress | null {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);
  if (!isRecord(raw)) return null;
  const { topicStatus, watched } = raw;
  if (topicStatus === undefined && watched === undefined) return null;
  if (topicStatus !== undefined && !isRecord(topicStatus)) return null;
  if (watched !== undefined && !isRecord(watched)) return null;

  const progress = emptyProgress();
  for (const [id, status] of Object.entries(topicStatus ?? {})) {
    if (VALID_STATUSES.includes(status as TopicStatus) && status !== "not-started") {
      progress.topicStatus[id] = status as TopicStatus;
    }
  }
  for (const [id, value] of Object.entries(watched ?? {})) {
    if (value === true) progress.watched[id] = true;
  }
  return progress;
}

function load(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored && parseProgress(JSON.parse(stored))) || emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage full or blocked: progress stays in memory for this session.
    }
  }, [progress]);

  const getStatus = useCallback(
    (topicId: number): TopicStatus => progress.topicStatus[topicId] ?? "not-started",
    [progress.topicStatus],
  );

  const setStatus = useCallback((topicId: number, status: TopicStatus) => {
    setProgress((prev) => {
      const topicStatus = { ...prev.topicStatus };
      if (status === "not-started") delete topicStatus[topicId];
      else topicStatus[topicId] = status;
      return { ...prev, topicStatus };
    });
  }, []);

  const isWatched = useCallback((id: string) => progress.watched[id] === true, [progress.watched]);

  const setWatched = useCallback((id: string, value: boolean) => {
    setProgress((prev) => {
      const watched = { ...prev.watched };
      if (value) watched[id] = true;
      else delete watched[id];
      return { ...prev, watched };
    });
  }, []);

  const exportJson = useCallback(() => JSON.stringify(progress, null, 2), [progress]);

  /** Replaces current progress. Returns false if the data is not valid progress. */
  const importJson = useCallback((text: string) => {
    let parsed: Progress | null = null;
    try {
      parsed = parseProgress(JSON.parse(text));
    } catch {
      return false;
    }
    if (!parsed) return false;
    setProgress(parsed);
    return true;
  }, []);

  const reset = useCallback(() => setProgress(emptyProgress()), []);

  return { progress, getStatus, setStatus, isWatched, setWatched, exportJson, importJson, reset };
}

export type ProgressApi = ReturnType<typeof useProgress>;
