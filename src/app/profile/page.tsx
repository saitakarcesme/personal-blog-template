import { albumPhotos } from "../../../data/album";
import { AlbumList } from "@/components/AlbumList";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { ProfileBadge } from "@/components/ProfileBadge";

export default function ProfilePage() {
  const photos = [...albumPhotos].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );

  return (
    <PageShell width="wide" wallpaper="profile">
      <PageHeader
        eyebrow="Profile"
        title="Ibrahim Sait Akarcesme"
        description="Computer Science student. Passionate about building software, exploring new technologies, and sharing my thoughts here."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        <ProfileBadge />

        <section>
          <h2 className="mb-6 font-serif text-3xl font-bold text-text-main">
            ISAlbum
          </h2>
          <AlbumList photos={photos} />
        </section>
      </div>
    </PageShell>
  );
}
