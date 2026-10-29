import type { Filters, Topic, TopicStatus } from "../types";
import { hasVideos } from "./roadmap";

export const defaultFilters: Filters = {
  search: "",
  priority: "",
  phase: "",
  status: "",
  playlist: "",
  gapsOnly: false,
  criticalOnly: false,
};

/** Number of filters set in the collapsible "Filters" panel. */
export function panelFilterCount(filters: Filters) {
  return [filters.priority, filters.status, filters.playlist].filter(Boolean).length;
}

/** True when anything other than the selected phase narrows the list. */
export function isFiltering(filters: Filters) {
  return Object.entries(filters).some(
    ([k, v]) => k !== "phase" && v !== defaultFilters[k as keyof Filters],
  );
}

/** All active filters combine with AND. */
export function matchesFilters(
  topic: Topic,
  filters: Filters,
  status: TopicStatus,
): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query && !`${topic.topic} ${topic.subtopics}`.toLowerCase().includes(query)) return false;
  if (filters.priority && topic.priority !== filters.priority) return false;
  if (filters.criticalOnly && topic.priority !== "★ Critical") return false;
  if (filters.phase && topic.phase !== filters.phase) return false;
  if (filters.status && status !== filters.status) return false;
  if (filters.playlist && topic.videos[filters.playlist].length === 0) return false;
  if (filters.gapsOnly && hasVideos(topic) && !topic.gapNote) return false;
  return true;
}
