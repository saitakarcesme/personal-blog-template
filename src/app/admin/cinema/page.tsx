import Link from "next/link";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { CinemaDeleteButton } from "@/components/CinemaDeleteButton";
import { getAllCinemaEntries } from "@/lib/cinema";
import { formatCinemaType } from "@/lib/cinemaFormat";

export default function AdminCinemaPage() {
  const entries = getAllCinemaEntries();

  return (
    <div className="mx-auto max-w-5xl pt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-main">
            Manage Cinema
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Add, edit, or delete movie and TV opinions.
          </p>
        </div>
        <Link
          href="/admin/cinema/new"
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
              <th className="hidden px-6 py-4 md:table-cell">IMDb</th>
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
                    {entry.year}
                  </div>
                </td>
                <td className="hidden px-6 py-4 text-text-muted sm:table-cell">
                  {formatCinemaType(entry.type)}
                </td>
                <td className="px-6 py-4 font-semibold text-text-main">
                  {entry.isaScore}/100
                </td>
                <td className="hidden px-6 py-4 text-text-muted md:table-cell">
                  {entry.imdbRating}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/cinema/edit/${entry.slug}`}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-accent transition-colors hover:bg-accent/10"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <FiEdit2 />
                    </Link>
                    <CinemaDeleteButton
                      slug={entry.slug}
                      title={entry.title}
                    />
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
                  No Cinema entries found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
