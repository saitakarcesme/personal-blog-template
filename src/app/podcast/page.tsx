import { podcastEpisodes } from "../../../data/podcasts";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { PodcastList } from "@/components/PodcastList";

export default function PodcastPage() {
  const episodes = [...podcastEpisodes].sort((a, b) => a.episode - b.episode);

  return (
    <PageShell wallpaper="podcast">
      <PageHeader
        eyebrow="Podcast"
        title="All episodes"
        description="The podcast archive, sorted from the first episode onward."
      />
      <PodcastList episodes={episodes} />
    </PageShell>
  );
}
