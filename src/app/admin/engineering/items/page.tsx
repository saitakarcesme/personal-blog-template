import Link from "next/link";
import { FiEdit2, FiPlus, FiStar } from "react-icons/fi";
import { EngineeringItemDeleteButton } from "@/components/EngineeringItemDeleteButton";
import {
  getAllEngineeringItems,
  getEngineeringContent,
} from "@/lib/engineering";

export default function AdminEngineeringItemsPage() {
  const items = getAllEngineeringItems();
  const { categories } = getEngineeringContent();
  const categoryTitle = (slug: string) =>
    categories.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <div className="mx-auto max-w-5xl pt-4">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-main">
            Engineering Items
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Devices, software, local models, anything that lives inside a category.
          </p>
        </div>
        <Link
          href="/admin/engineering/items/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-background shadow-sm transition-all hover:opacity-90"
        >
          <FiPlus /> New Item
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover/50 text-xs font-bold uppercase tracking-wider text-text-subtle">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="hidden px-6 py-4 sm:table-cell">Category</th>
              <th className="hidden px-6 py-4 md:table-cell">Status</th>
              <th className="px-6 py-4 text-center">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.slug} className="transition-colors hover:bg-surface-hover/30">
                <td className="px-6 py-4">
                  <div className="font-serif font-medium text-text-main">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs text-text-subtle">{item.slug}</div>
                </td>
                <td className="hidden px-6 py-4 text-text-muted sm:table-cell">
                  {categoryTitle(item.category)}
                </td>
                <td className="hidden px-6 py-4 text-text-muted md:table-cell">
                  {item.status}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.featured ? (
                    <FiStar className="mx-auto text-accent-indigo" aria-label="Featured" />
                  ) : null}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/engineering/items/edit/${item.slug}`}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-accent transition-colors hover:bg-accent/10"
                      aria-label={`Edit ${item.title}`}
                    >
                      <FiEdit2 />
                    </Link>
                    <EngineeringItemDeleteButton slug={item.slug} title={item.title} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-text-muted">
                  No Engineering items yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
