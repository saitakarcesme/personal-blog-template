import Link from "next/link";
import type { CinemaListItem } from "@/lib/cinema";
import { formatCinemaType, formatImdbRating } from "@/lib/cinemaFormat";
import { MediaArtwork } from "@/components/MediaArtwork";

export function CinemaCard({ entry }: { entry: CinemaListItem }) {
  return (
    <article className="transition-colors group grid gap-5 rounded-lg border border-border bg-surface/70 p-4 hover:bg-surface-hover/70 sm:grid-cols-[140px_minmax(0,1fr)]">
      <Link
        href={`/cinema/${entry.slug}`}
        className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface"
        aria-label={entry.title}
      >
        <MediaArtwork
          src={entry.poster}
          alt={`${entry.title} poster`}
          label="No Poster"
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-subtle">
          <span>{formatCinemaType(entry.type)}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{entry.year}</span>
        </div>

        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-text-main">
          <Link
            href={`/cinema/${entry.slug}`}
            className="hover:underline hover:underline-offset-4"
          >
            {entry.title}
          </Link>
        </h2>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-subtle">
              ISA Score
            </p>
            <p className="mt-1 font-serif text-4xl font-semibold leading-none text-text-main">
              {entry.isaScore}
              <span className="ml-1 text-base text-text-muted">/100</span>
            </p>
          </div>
          <div className="pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-subtle">
              IMDb
            </p>
            <p className="mt-1 text-lg font-semibold text-text-muted">
              {formatImdbRating(entry.imdbRating)}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-muted">
          {entry.excerpt || "No opinion written yet."}
        </p>
      </div>
    </article>
  );
}
