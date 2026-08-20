import { albumPhotos } from "../../../data/album";
import { AlbumList } from "@/components/AlbumList";
import { Column } from "@/components/Column";

export default function AlbumPage() {
  const photos = [...albumPhotos].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <div className="min-h-dvh text-foreground">
      <main className="mx-auto max-w-6xl px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase text-text-subtle">
            Photo archive
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-text-main font-serif">
            Album
          </h1>
        </header>
        <Column className="min-h-0">
          <AlbumList photos={photos} />
        </Column>
      </main>
    </div>
  );
}
