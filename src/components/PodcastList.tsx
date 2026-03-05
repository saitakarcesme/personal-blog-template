"use client";

import Link from "next/link";
import type { PodcastEpisode } from "../../data/podcasts";
import { useThemeClasses } from "./useThemeClasses";

export function PodcastList({ episodes, limitOnMobile }: { episodes: PodcastEpisode[]; limitOnMobile?: boolean }) {
  const tc = useThemeClasses();

  if (episodes.length === 0) {
    return <p className={`text-sm ${tc.textMuted}`}>No episodes yet.</p>;
  }

  return (
    <>
      <ol className="space-y-2">
        {episodes.map((ep, index) => (
          <li key={`${ep.episode}-${index}`} className={limitOnMobile && index > 0 ? "hidden sm:block" : ""}>
            <Link
              href={`/podcasts/${ep.episode}`}
              className={`block min-w-0 px-3 py-2 ${tc.listItem}`}
            >
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <span className={`min-w-0 truncate text-sm font-medium ${tc.text}`}>
                  {ep.title}
                </span>
                <span className={`shrink-0 text-xs tabular-nums ${tc.textSubtle}`}>
                  Ep {ep.episode}
                </span>
              </div>
              {ep.date ? (
                <div className={`mt-1 text-xs tabular-nums ${tc.textSubtle}`}>
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
            className={`text-sm underline underline-offset-4 hover:opacity-80 ${tc.text}`}
          >
            View all podcasts
          </Link>
        </div>
      )}
    </>
  );
}
