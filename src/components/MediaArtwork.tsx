import Image from "next/image";

export function MediaArtwork({
  src,
  alt,
  priority = false,
  label = "No Image",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  label?: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-surface text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-subtle">
        {label}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 90vw, 320px"
      priority={priority}
      className="object-cover"
    />
  );
}
