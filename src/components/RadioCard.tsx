import Link from "next/link";
import type { RadioListItem } from "@/lib/radio";
import { formatRadioType } from "@/lib/radioFormat";
import { MediaArtwork } from "@/components/MediaArtwork";

export function RadioCard({ entry }: { entry: RadioListItem }) {
  return (
    <article className="group grid gap-5 rounded-lg border border-border bg-surface/70 p-4 transition-colors hover:bg-surface-hover/70 sm:grid-cols-[140px_minmax(0,1fr)]">
      <Link
        href={`/radio/${entry.slug}`}
        className="relative aspect-square overflow-hidden rounded-md bg-surface"
        aria-label={entry.title}
      >
        <MediaArtwork
          src={entry.cover}
          alt={`${entry.title} cover art`}
          label="No Cover"
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-subtle">
          <span>{formatRadioType(entry.type)}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{entry.year}</span>
        </div>

        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-text-main">
          <Link
            href={`/radio/${entry.slug}`}
            className="hover:underline hover:underline-offset-4"
          >
            {entry.title}
          </Link>
        </h2>

        <p className="mt-1 truncate text-sm text-text-muted">{entry.artist}</p>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-subtle">
            ISA Score
          </p>
          <p className="mt-1 font-serif text-4xl font-semibold leading-none text-text-main">
            {entry.isaScore}
            <span className="ml-1 text-base text-text-muted">/100</span>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-muted">
          {entry.excerpt || "No opinion written yet."}
        </p>
      </div>
    </article>
  );
}
