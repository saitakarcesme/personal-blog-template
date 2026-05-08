import { RadioForm } from "@/components/RadioForm";
import { getRadioEntryBySlug } from "@/lib/radio";
import { FiRadio } from "react-icons/fi";

export default async function EditRadioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getRadioEntryBySlug(slug);

  if (!entry) {
    return <div className="mt-10 text-center">Radio entry not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
          <FiRadio />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            Edit Radio Entry
          </h1>
          <p className="text-sm text-text-muted">
            Update metadata, score, mood, or your written opinion.
          </p>
        </div>
      </div>

      <RadioForm
        mode="edit"
        initialData={{
          slug: entry.slug,
          title: entry.title,
          artist: entry.artist === "Unknown Artist" ? "" : entry.artist,
          year: entry.year === "N/A" ? "" : entry.year,
          type: entry.type,
          cover: entry.cover ?? "",
          sourceId: entry.sourceId ?? "",
          sourceUrl: entry.sourceUrl ?? "",
          isaScore: entry.isaScore,
          mood: entry.mood ?? "",
          listenedDate: entry.listenedDate ?? "",
          createdAt: entry.createdAt ?? "",
          content: entry.content,
        }}
      />
    </div>
  );
}
