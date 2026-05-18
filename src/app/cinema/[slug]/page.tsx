import { BackButton } from "@/components/BackButton";
import { MediaArtwork } from "@/components/MediaArtwork";
import { PageShell } from "@/components/PageShell";
import {
  getCinemaEntryBySlug,
  getCinemaSlugFromFileName,
  getCinemaSlugs,
} from "@/lib/cinema";
import { formatCinemaType, formatImdbRating } from "@/lib/cinemaFormat";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getCinemaSlugs().map((fileName) => ({
    slug: getCinemaSlugFromFileName(fileName),
  }));
}

export default async function CinemaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getCinemaEntryBySlug(slug);

  if (!entry) notFound();

  return (
    <PageShell width="wide" wallpaper="cinema">
      <BackButton href="/cinema" />

      <article className="mt-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-surface shadow-sm lg:mx-0">
          <MediaArtwork
            src={entry.poster}
            alt={`${entry.title} poster`}
            priority
            label="No Poster"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-subtle">
            <span>{formatCinemaType(entry.type)}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{entry.year}</span>
            {entry.watchedDate ? (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Watched {entry.watchedDate}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight text-text-main sm:text-5xl">
            {entry.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-end gap-6 border-y border-border py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                ISA Score
              </p>
              <p className="mt-2 font-serif text-6xl font-semibold leading-none text-text-main">
                {entry.isaScore}
                <span className="ml-2 text-xl text-text-muted">/100</span>
              </p>
            </div>

            <div className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                IMDb
              </p>
              <p className="mt-2 text-2xl font-semibold text-text-muted">
                {formatImdbRating(entry.imdbRating)}
              </p>
            </div>
          </div>

          <div
            className="prose prose-neutral dark:prose-invert mt-8 max-w-2xl font-serif text-lg leading-loose prose-p:text-text-main prose-headings:font-serif prose-headings:text-text-main prose-a:text-text-main prose-a:underline-offset-4 prose-strong:text-text-main"
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        </div>
      </article>
    </PageShell>
  );
}
