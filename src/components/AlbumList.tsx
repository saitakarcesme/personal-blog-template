"use client";

import Link from "next/link";
import type { AlbumPhoto } from "../../data/album";

export function AlbumList({ photos, limitOnMobile }: { photos: AlbumPhoto[]; limitOnMobile?: boolean }) {
  if (photos.length === 0) {
    return <p className="text-sm text-text-muted">No photos yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className={`group relative aspect-square overflow-hidden rounded-xl bg-surface border border-border ${limitOnMobile && index > 1 ? "hidden sm:block" : ""}`}>
            <Link href={`/album/${photo.id}`} className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl">
              <span className="sr-only">View photo from {photo.date}</span>
            </Link>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={photo.url} 
              alt={photo.description || `Photo from ${photo.date}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-3">
               <span className="text-xs font-bold text-white drop-shadow-md">{photo.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
