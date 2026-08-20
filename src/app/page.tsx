import { podcastEpisodes } from "../../data/podcasts";
import { albumPhotos } from "../../data/album";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiCode, FiEdit3, FiGithub, FiLinkedin, FiMic } from "react-icons/fi";
import { MissileBase } from "@/components/MissileBase";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export default function Home() {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const episodes = [...podcastEpisodes].sort((a, b) => a.episode - b.episode);
  const photos = [...albumPhotos].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const latestPost = posts[0];
  const latestProject = projects[0];
  const latestEpisode = episodes[episodes.length - 1];
  const latestPhoto = photos[0];

  const sections = [
    {
      title: "Blog",
      href: "/posts",
      icon: FiEdit3,
      summary: latestPost ? latestPost.title : "Thoughts, essays, and notes.",
      meta: `${posts.length} posts`,
    },
    {
      title: "Podcast",
      href: "/podcasts",
      icon: FiMic,
      summary: latestEpisode ? latestEpisode.title : "Long-form conversations and updates.",
      meta: `${episodes.length} episodes`,
    },
    {
      title: "Album",
      href: "/album",
      icon: FiCamera,
      summary: latestPhoto ? latestPhoto.date : "A visual archive from life and work.",
      meta: `${photos.length} photos`,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: FiCode,
      summary: latestProject ? latestProject.title : "Things I build and ship.",
      meta: `${projects.length} projects`,
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col text-foreground">
      <main className="flex-1 px-4 pt-28 pb-16 sm:px-6 xl:px-8">
        <section className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="min-w-0">
            <p className="mb-4 text-sm font-semibold uppercase text-text-subtle">
              Personal blog, podcast, album, and projects
            </p>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-text-main font-serif sm:text-6xl lg:text-7xl">
              Ibrahim Sait Akarcesme
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted font-serif">
              Computer Science student building software, writing in public, recording ideas, and keeping a small visual archive along the way.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-full bg-text-main px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85"
              >
                Read the blog
                <FiArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-main transition hover:bg-surface-hover"
              >
                See projects
                <FiCode className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="https://github.com/saitakarcesme"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition hover:bg-surface-hover hover:text-text-main"
              >
                <FiGithub className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ibrahim-sait-akarcesme-4b360b209/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition hover:bg-surface-hover hover:text-text-main"
              >
                <FiLinkedin className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <Image
                src="/profilepic.jpeg"
                alt="Ibrahim Sait Akarcesme"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group flex min-h-48 flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
                >
                  <div>
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted group-hover:text-text-main">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main font-serif">
                      {section.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-muted">
                      {section.summary}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase text-text-subtle">
                    <span>{section.meta}</span>
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <MissileBase />
    </div>
  );
}
