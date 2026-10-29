import { searchQueries, youtubeSearchUrl } from "../lib/roadmap";
import type { Topic } from "../types";

interface GapBannerProps {
  topic: Topic;
  variant: "missing" | "partial";
}

const variantStyles = {
  missing: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
  partial:
    "border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-100",
};

export function GapBanner({ topic, variant }: GapBannerProps) {
  const queries = searchQueries(topic);
  return (
    <div role="note" className={`rounded-lg border p-3 text-sm ${variantStyles[variant]}`}>
      <p>
        <strong>{variant === "missing" ? "Not covered" : "Partial coverage"}</strong>
        {topic.gapNote && <> — {topic.gapNote.replace(/^NOT COVERED\s*—\s*/, "")}</>}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {queries.map((query) => (
          <a
            key={query}
            href={youtubeSearchUrl(query)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white outline-none hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            Search YouTube{queries.length > 1 && <span className="font-normal opacity-90">: {query}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
