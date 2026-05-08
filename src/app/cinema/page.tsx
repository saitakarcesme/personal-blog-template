import { CinemaCard } from "@/components/CinemaCard";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { getAllCinemaEntries } from "@/lib/cinema";

export default function CinemaPage() {
  const entries = getAllCinemaEntries();

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Cinema"
        title="Movies and TV, rated personally"
        description="A running notebook of what I watched, what stayed with me, and how strongly I would recommend it."
      />

      {entries.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {entries.map((entry) => (
            <CinemaCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface/70 p-8 text-center text-text-muted">
          No Cinema entries yet.
        </div>
      )}
    </PageShell>
  );
}
