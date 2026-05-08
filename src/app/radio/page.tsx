import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { RadioCard } from "@/components/RadioCard";
import { getAllRadioEntries } from "@/lib/radio";

export default function RadioPage() {
  const entries = getAllRadioEntries();

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Radio"
        title="Songs, albums, and playlists I keep returning to"
        description="A personal listening log with notes, moods, and ISA Scores."
      />

      {entries.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {entries.map((entry) => (
            <RadioCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface/70 p-8 text-center text-text-muted">
          No Radio entries yet.
        </div>
      )}
    </PageShell>
  );
}
