import Link from "next/link";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { RadioDeleteButton } from "@/components/RadioDeleteButton";
import { getAllRadioEntries } from "@/lib/radio";
import { formatRadioType } from "@/lib/radioFormat";

export default function AdminRadioPage() {
  const entries = getAllRadioEntries();

  return (
    <div className="mx-auto max-w-5xl pt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            Manage Radio
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Add, edit, or delete music opinions.
          </p>
        </div>
        <Link
          href="/admin/radio/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-background shadow-sm transition-all hover:opacity-90"
        >
          <FiPlus /> New Entry
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover/50 text-xs font-bold uppercase tracking-wider text-text-subtle">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="hidden px-6 py-4 sm:table-cell">Type</th>
              <th className="px-6 py-4">ISA</th>
              <th className="hidden px-6 py-4 md:table-cell">Mood</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => (
              <tr
                key={entry.slug}
                className="transition-colors hover:bg-surface-hover/30"
              >
                <td className="px-6 py-4">
                  <div className="font-serif font-medium text-text-main">
                    {entry.title}
                  </div>
                  <div className="mt-1 text-xs text-text-subtle">
                    {entry.artist} {entry.year !== "N/A" ? `- ${entry.year}` : ""}
                  </div>
                </td>
                <td className="hidden px-6 py-4 text-text-muted sm:table-cell">
                  {formatRadioType(entry.type)}
                </td>
                <td className="px-6 py-4 font-semibold text-text-main">
                  {entry.isaScore}/100
                </td>
                <td className="hidden px-6 py-4 text-text-muted md:table-cell">
                  {entry.mood || "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/radio/edit/${entry.slug}`}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-accent transition-colors hover:bg-accent/10"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <FiEdit2 />
                    </Link>
                    <RadioDeleteButton slug={entry.slug} title={entry.title} />
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-text-muted"
                >
                  No Radio entries found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
