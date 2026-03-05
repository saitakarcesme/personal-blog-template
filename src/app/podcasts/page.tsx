import { BackButton } from "@/components/BackButton";
import { PodcastList } from "@/components/PodcastList";
import { podcastEpisodes } from "../../../data/podcasts";
import { Column } from "@/components/Column";

export default function PodcastsPage() {
    const episodes = [...podcastEpisodes].sort((a, b) => a.episode - b.episode);

    return (
        <div className="min-h-dvh text-foreground">
            <main className="mx-auto max-w-3xl px-4 pt-24 pb-10 min-[1300px]:py-10 sm:px-6 lg:px-8">
                <BackButton />
                <header className="mt-8 mb-8">
                    <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                        All Podcasts
                    </h1>
                </header>
                <Column className="min-h-0">
                    <PodcastList episodes={episodes} />
                </Column>
            </main>
        </div>
    );
}
