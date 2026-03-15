"use client";

import Link from "next/link";
import type { PodcastEpisode } from "../../data/podcasts";

export function PodcastList({ episodes, limitOnMobile }: { episodes: PodcastEpisode[]; limitOnMobile?: boolean }) {
  if (episodes.length === 0) {
    return <p className="text-sm text-text-muted">No episodes yet.</p>;
  }

  return (
    <>
      <ol className="flex flex-col gap-2">
        {episodes.map((ep, index) => (
          <li key={`${ep.episode}-${index}`} className={limitOnMobile && index > 0 ? "hidden sm:block" : ""}>
            <Link
              href={`/podcasts/${ep.episode}`}
              className="block min-w-0 p-3 rounded-lg hover:bg-surface-hover transition-colors group"
            >
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <span className="min-w-0 font-serif font-bold text-text-main group-hover:underline">
                  {ep.title}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-text-subtle font-medium">
                  Ep {ep.episode}
                </span>
              </div>
              {ep.date ? (
                <div className="mt-1 text-xs tabular-nums text-text-muted">
                  {ep.date}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
      {limitOnMobile && episodes.length > 1 && (
        <div className="mt-4 sm:hidden">
          <Link
            href="/podcasts"
            className="text-sm underline underline-offset-4 hover:opacity-80 text-text-main"
          >
            View all podcasts
          </Link>
        </div>
      )}
    </>
  );
}
