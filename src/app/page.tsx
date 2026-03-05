import { podcastEpisodes } from "../../data/podcasts";
import { BlogList } from "@/components/BlogList";
import { Column } from "@/components/Column";
import { PodcastList } from "@/components/PodcastList";
import { ProjectList } from "@/components/ProjectList";
import { MissileBase } from "@/components/MissileBase";
import { ProfileCard } from "@/components/ProfileCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const episodes = [...podcastEpisodes].sort((a, b) => a.episode - b.episode);

  return (
    <div className="flex min-[1300px]:h-dvh flex-col min-[1300px]:overflow-hidden text-foreground">
      <main className="min-h-0 flex-1 min-[1300px]:overflow-hidden px-4 py-6 sm:px-6 xl:px-8">
        <div className="mx-auto grid min-[1300px]:h-full max-w-7xl min-h-0 grid-cols-1 gap-4 min-[1300px]:overflow-hidden min-[1300px]:grid-cols-[1fr_2fr_1fr] min-[1300px]:grid-rows-1 min-[1300px]:gap-5">
          <div className="order-1 min-h-0 min-w-0 max-[1300px]:hidden min-[1300px]:order-3">
            <Column className="h-full">
              <ProfileCard />
            </Column>
          </div>

          <div className="order-2 flex flex-col min-[1300px]:order-2 min-[1300px]:min-h-0">
            <Column title="ISABlog" scrollable className="min-w-0 flex-1 min-[1300px]:min-h-0 min-[1300px]:min-w-[320px]">
              <BlogList posts={posts} limitOnMobile />
            </Column>
          </div>

          <div className="order-3 flex flex-col gap-4 min-[1300px]:order-1 min-[1300px]:min-h-0 min-[1300px]:gap-5">
            <Column title="ISAPodcast" scrollable className="min-w-0 flex-1 min-[1300px]:min-h-0">
              <PodcastList episodes={episodes} limitOnMobile />
            </Column>
            <Column title="Projects" scrollable className="min-w-0 flex-1 min-[1300px]:min-h-0">
              <ProjectList limitOnMobile />
            </Column>
          </div>
        </div>
      </main>
      <MissileBase />
    </div>
  );
}
