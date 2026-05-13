import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PortfolioStats } from "@/components/PortfolioStats";
import { getCinemaSlugs } from "@/lib/cinema";
import { getPostSlugs } from "@/lib/posts";
import { getProjectSlugs } from "@/lib/projects";
import { getRadioSlugs } from "@/lib/radio";
import { albumPhotos } from "../../data/album";
import { podcastEpisodes } from "../../data/podcasts";

const destinations = [
  {
    href: "/blog",
    title: "Blog",
    description: "Essays, notes, and personal reflections.",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Software experiments and build logs.",
  },
  {
    href: "/cinema",
    title: "Cinema",
    description: "Movies and TV shows scored with a personal lens.",
  },
  {
    href: "/radio",
    title: "Radio",
    description: "Songs, albums, and playlists with notes and scores.",
  },
  {
    href: "/podcast",
    title: "Podcast",
    description: "Conversations and episodes collected in one place.",
  },
  {
    href: "/engineering",
    title: "Engineering",
    description: "Setup, workflow, experiments, and technical notes.",
  },
  {
    href: "/profile",
    title: "Profile",
    description: "About me, social links, Tetris, and the album.",
  },
];

export default function Home() {
  const stats = [
    { label: "Posts", value: getPostSlugs().length },
    { label: "Projects", value: getProjectSlugs().length },
    { label: "Podcast Episodes", value: podcastEpisodes.length },
    { label: "Photos", value: albumPhotos.length },
    { label: "Cinema", value: getCinemaSlugs().length },
    { label: "Radio", value: getRadioSlugs().length },
  ];

  return (
    <div className="relative isolate overflow-hidden">
      <PageShell width="wide" className="flex flex-col gap-10 py-12 sm:gap-14 sm:py-16">
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.6fr)] md:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase text-text-subtle">
              Personal blog
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-text-main sm:text-5xl">
              Ideas, projects, and notes from Ibrahim Sait.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-muted">
              A quieter home for writing, project work, podcast episodes, and a
              more personal profile space.
            </p>
          </div>

          <Link
            href="/profile"
            className="group flex w-full max-w-sm items-center gap-4 rounded-lg border border-border bg-surface/95 p-4 transition-colors hover:bg-surface-hover md:max-w-xs md:justify-self-end"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-ring">
              <Image
                src="/profilepic.jpeg"
                alt="Ibrahim Sait Akarcesme"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold text-text-main">
                Ibrahim Sait Akarcesme
              </p>
              <p className="mt-1 text-sm text-text-muted group-hover:text-text-main">
                View profile -&gt;
              </p>
            </div>
          </Link>
        </section>

        <section
          aria-label="Site sections"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {destinations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-36 flex-col justify-between rounded-lg border border-border bg-surface/95 p-5 transition-colors hover:bg-surface-hover sm:min-h-40"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold text-text-main">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  {item.description}
                </p>
              </div>
              <span className="mt-6 text-sm font-semibold text-text-subtle transition-colors group-hover:text-text-main">
                Open -&gt;
              </span>
            </Link>
          ))}
        </section>

        <PortfolioStats stats={stats} />
      </PageShell>
    </div>
  );
}
