import { BackButton } from "@/components/BackButton";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { podcastEpisodes } from "../../../../data/podcasts";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return podcastEpisodes.map((ep) => ({
    episode: String(ep.episode),
  }));
}

export default async function PodcastEpisodePage({
  params,
}: {
  params: Promise<{ episode: string }>;
}) {
  const { episode: episodeParam } = await params;
  const episodeNumber = Number(episodeParam);
  const episode = podcastEpisodes.find((e) => e.episode === episodeNumber);
  if (!episode) notFound();

  const embedUrl = getYouTubeEmbedUrl(episode.youtubeUrl);
  if (!embedUrl) notFound();

  return (
    <div className="min-h-dvh text-foreground">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton />

        <header className="mt-8">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            {episode.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
            <span className="tabular-nums">Ep {episode.episode}</span>
            {episode.date ? (
              <span className="tabular-nums">{episode.date}</span>
            ) : null}
            <Link
              href={episode.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline-offset-4 hover:underline"
            >
              Open on YouTube
            </Link>
          </div>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </main>
    </div>
  );
}

