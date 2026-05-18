import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { MediaArtwork } from "@/components/MediaArtwork";
import { PageShell } from "@/components/PageShell";
import {
  getRadioEntryBySlug,
  getRadioSlugFromFileName,
  getRadioSlugs,
} from "@/lib/radio";
import { formatRadioType } from "@/lib/radioFormat";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getRadioSlugs().map((fileName) => ({
    slug: getRadioSlugFromFileName(fileName),
  }));
}

export default async function RadioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getRadioEntryBySlug(slug);

  if (!entry) notFound();

  return (
    <PageShell width="wide" wallpaper="radio">
      <BackButton href="/radio" />

      <article className="mt-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-border bg-surface shadow-sm lg:mx-0">
          <MediaArtwork
            src={entry.cover}
            alt={`${entry.title} cover art`}
            priority
            label="No Cover"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-subtle">
            <span>{formatRadioType(entry.type)}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{entry.year}</span>
            {entry.listenedDate ? (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Listened {entry.listenedDate}</span>
              </>
            ) : null}
            {entry.mood ? (
              <>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{entry.mood}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight text-text-main sm:text-5xl">
            {entry.title}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{entry.artist}</p>

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
          </div>

          {entry.sourceUrl ? (
            <Link
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-main transition-colors hover:bg-surface-hover"
            >
              Open music link
            </Link>
          ) : null}

          <div
            className="prose prose-neutral dark:prose-invert mt-8 max-w-2xl font-serif text-lg leading-loose prose-p:text-text-main prose-headings:font-serif prose-headings:text-text-main prose-a:text-text-main prose-a:underline-offset-4 prose-strong:text-text-main"
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        </div>
      </article>
    </PageShell>
  );
}
