import { podcastEpisodes } from "../../data/podcasts";
import { albumPhotos } from "../../data/album";
import { BlogList } from "@/components/BlogList";
import { Column } from "@/components/Column";
import { PodcastList } from "@/components/PodcastList";
import { ProjectList } from "@/components/ProjectList";
import { AlbumList } from "@/components/AlbumList";
import { MissileBase } from "@/components/MissileBase";
import { ProfileCard } from "@/components/ProfileCard";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export default function Home() {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const episodes = [...podcastEpisodes].sort((a, b) => a.episode - b.episode);
  const photos = [...albumPhotos].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <div className="flex flex-col min-h-dvh text-foreground">
      <main className="flex-1 px-4 py-8 pt-24 pb-16 min-[1300px]:py-6 sm:px-6 xl:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 min-[1300px]:grid-cols-[1fr_2fr_1fr] min-[1300px]:items-start min-[1300px]:gap-5">
          <div className="order-1 min-w-0 max-[1300px]:hidden min-[1300px]:order-3 min-[1300px]:sticky min-[1300px]:top-6 min-[1300px]:max-h-[calc(100vh-3rem)] flex flex-col">
            <Column className="flex-1 h-full" scrollable>
              <ProfileCard />
            </Column>
          </div>

          <div className="order-2 flex flex-col min-[1300px]:order-2 min-w-0">
            <Column title="ISABlog" scrollable className="min-w-0 min-[1300px]:min-w-[320px] max-h-[80vh] min-[1300px]:max-h-[calc(100vh-3rem)]">
              <BlogList posts={posts} limitOnMobile />
            </Column>
          </div>

          <div className="order-3 flex flex-col gap-4 min-[1300px]:order-1 min-[1300px]:sticky min-[1300px]:top-6 min-[1300px]:max-h-[calc(100vh-3rem)] min-[1300px]:gap-5 min-w-0">
            <Column title="ISAPodcast" scrollable className="min-w-0 flex-none min-[1300px]:max-h-[40vh]">
              <PodcastList episodes={episodes} limitOnMobile />
            </Column>
            <Column title="Projects" scrollable className="min-w-0 flex-1">
              <ProjectList projects={projects} limitOnMobile />
            </Column>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl mt-8">
          <Column title="ISAlbum" className="w-full">
            <AlbumList photos={photos} />
          </Column>
        </div>
      </main>
      <MissileBase />
    </div>
  );
}
