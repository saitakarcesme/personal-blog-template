import { CinemaForm } from "@/components/CinemaForm";
import { getCinemaEntryBySlug } from "@/lib/cinema";
import { FiStar } from "react-icons/fi";

export default async function EditCinemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getCinemaEntryBySlug(slug);

  if (!entry) {
    return <div className="mt-10 text-center">Cinema entry not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
          <FiStar />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            Edit Cinema Entry
          </h1>
          <p className="text-sm text-text-muted">
            Update metadata, score, or your written opinion.
          </p>
        </div>
      </div>

      <CinemaForm
        mode="edit"
        initialData={{
          slug: entry.slug,
          title: entry.title,
          year: entry.year === "N/A" ? "" : entry.year,
          type: entry.type,
          poster: entry.poster ?? "",
          imdbId: entry.imdbId ?? "",
          imdbRating: entry.imdbRating,
          isaScore: entry.isaScore,
          watchedDate: entry.watchedDate ?? "",
          createdAt: entry.createdAt ?? "",
          content: entry.content,
        }}
      />
    </div>
  );
}
