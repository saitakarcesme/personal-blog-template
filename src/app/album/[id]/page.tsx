import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albumPhotos } from "../../../../data/album";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";

export function generateStaticParams() {
  return albumPhotos.map((photo) => ({
    id: photo.id,
  }));
}

export default async function AlbumPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = albumPhotos.find((p) => p.id === id);

  if (!photo) {
    notFound();
  }

  return (
    <div className="min-h-dvh flex flex-col items-center bg-background text-foreground px-4 py-10 fade-in">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <Link
          href="/profile"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-text-subtle hover:text-text-main transition-colors w-fit"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <div className="relative flex min-h-[50vh] w-full items-center justify-center bg-black/10 sm:min-h-[62vh]">
            <Image
              src={photo.url}
              alt={photo.description || `Photo from ${photo.date}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              quality={82}
              priority
              className="object-contain"
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-muted font-mono text-sm">
              <FiCalendar />
              <span>{photo.date}</span>
            </div>

            {photo.description && (
              <p className="text-text-main text-lg font-serif leading-relaxed">
                {photo.description}
              </p>
            )}

            {!photo.description && (
              <p className="text-text-muted italic text-sm">
                No description provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
