import Image from "next/image";
import Link from "next/link";
import type { AlbumPhoto } from "../../data/album";

export function AlbumList({
  photos,
  limitOnMobile,
}: {
  photos: AlbumPhoto[];
  limitOnMobile?: boolean;
}) {
  if (photos.length === 0) {
    return <p className="text-sm text-text-muted">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className={`album-tile group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface ${
            limitOnMobile && index > 1 ? "hidden sm:block" : ""
          }`}
        >
          <Image
            src={photo.url}
            alt={photo.description || `Photo from ${photo.date}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 150px"
            quality={68}
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
          <Link
            href={`/album/${photo.id}`}
            className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="sr-only">View photo from {photo.date}</span>
          </Link>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/80 via-background/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none">
            <span className="text-xs font-bold text-text-main">{photo.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
