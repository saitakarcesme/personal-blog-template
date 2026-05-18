/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import {
  getEngineeringContent,
  getItemsForCategory,
} from "@/lib/engineering";

export default async function EngineeringCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const { categories } = getEngineeringContent();
  const category = categories.find(
    (c) => c.slug === categorySlug && c.visible !== false,
  );
  if (!category) notFound();

  const items = getItemsForCategory(categorySlug);

  return (
    <PageShell width="wide" wallpaper="engineering" className="flex flex-col gap-10">
      <div>
        <div className="mb-6">
          <BackButton href="/engineering" />
        </div>
        <PageHeader
          eyebrow={`Engineering / ${category.title}`}
          title={category.title}
          description={category.description}
        />
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="transition-colors flex scroll-mt-24 flex-col gap-3 rounded-lg border border-border bg-surface/95 p-5"
            >
              {item.imageUrl ? (
                <div className="overflow-hidden rounded-md border border-border bg-background">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-serif text-xl font-bold text-text-main">
                  {item.title}
                </h2>
                {item.status ? (
                  <span className="inline-flex items-center rounded-md border border-border bg-surface-hover px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-main">
                    {item.status}
                  </span>
                ) : null}
              </div>

              {item.useCase ? (
                <p className="text-xs uppercase tracking-wide text-text-subtle">
                  {item.useCase}
                </p>
              ) : null}

              {item.shortDescription ? (
                <p className="text-sm leading-6 text-text-muted">
                  {item.shortDescription}
                </p>
              ) : null}

              {item.specs.length > 0 ? (
                <dl className="mt-1 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-xs">
                  {item.specs.map((spec) => (
                    <div key={`${spec.key}-${spec.value}`} className="contents">
                      <dt className="text-text-subtle">{spec.key}</dt>
                      <dd className="text-text-muted">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface/70 p-8 text-center text-text-muted">
          No items in <span className="text-text-main">{category.title}</span>{" "}
          yet. Add one from{" "}
          <Link
            href="/admin/engineering/items/new"
            className="text-text-main underline hover:text-text-muted"
          >
            /admin/engineering/items/new
          </Link>
          .
        </div>
      )}
    </PageShell>
  );
}
