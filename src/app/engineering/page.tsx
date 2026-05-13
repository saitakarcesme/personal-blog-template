import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import {
  countItemsByCategory,
  getFeaturedEngineeringItems,
  getVisibleEngineeringContent,
} from "@/lib/engineering";

function StatusBadge({ value, kind }: { value: string; kind: "item" | "experiment" | "log" }) {
  const normalized = value.toLowerCase();
  const accent =
    normalized === "active" || normalized === "shipped"
      ? "border-accent-indigo/40 bg-accent-indigo/10 text-accent-indigo"
      : normalized === "testing" || normalized === "ongoing"
        ? "border-border bg-surface-hover text-text-main"
        : normalized === "planned"
          ? "border-border bg-surface text-text-muted"
          : "border-border bg-surface text-text-subtle";
  void kind;
  return (
    <span
      className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${accent}`}
    >
      {value}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-indigo/80">
        {eyebrow}
      </p>
      <h2 className="font-serif text-2xl font-bold text-text-main sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function EngineeringPage() {
  const { hero, categories, workflow, log, experiments, principles } =
    getVisibleEngineeringContent();
  const featured = getFeaturedEngineeringItems(6);
  const counts = countItemsByCategory();

  return (
    <PageShell width="wide" className="flex flex-col gap-14">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -top-10 -z-10 h-56 rounded-full bg-accent-indigo/10 blur-3xl"
        />
        <PageHeader
          eyebrow={hero.label || "Engineering"}
          title={hero.title || "Engineering"}
          description={hero.subtitle}
        />
      </div>

      {categories.length > 0 ? (
        <section aria-label="Current stack">
          <SectionHeading
            eyebrow="Current stack"
            title="Setup"
            description="Categories you can explore. Each one opens a focused view of the tools and devices in it."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = counts[cat.slug] ?? 0;
              return (
                <Link
                  key={cat.id}
                  href={`/engineering/${cat.slug}`}
                  className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-surface/95 p-5 transition-colors hover:border-accent-indigo/40 hover:bg-surface-hover"
                >
                  <div>
                    <h3 className="font-serif text-xl font-bold text-text-main">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-text-subtle">
                    <span>
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                    <span className="font-semibold transition-colors group-hover:text-accent-indigo">
                      Open -&gt;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section aria-label="Featured items">
          <SectionHeading
            eyebrow="Featured"
            title="Highlighted gear and tools"
            description="What I rely on most day-to-day."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={`/engineering/${item.category}#${item.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface/95 p-5 transition-colors hover:border-accent-indigo/40 hover:bg-surface-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-text-main">
                    {item.title}
                  </h3>
                  {item.status ? <StatusBadge value={item.status} kind="item" /> : null}
                </div>
                {item.shortDescription ? (
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {item.shortDescription}
                  </p>
                ) : null}
                {item.useCase ? (
                  <p className="mt-3 text-xs uppercase tracking-wide text-text-subtle">
                    {item.useCase}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {workflow.length > 0 ? (
        <section aria-label="Workflow timeline">
          <SectionHeading
            eyebrow="Workflow"
            title="How my coding flow has evolved"
            description="From writing every line by hand to working alongside agents."
          />
          <ol className="relative ml-2 border-l border-border">
            {workflow.map((step) => (
              <li key={step.id} className="relative pb-8 pl-6 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[7px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-accent-indigo/40 bg-background"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-indigo/80">
                  {step.stepLabel}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-text-main">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {log.length > 0 ? (
        <section aria-label="Engineering log">
          <SectionHeading
            eyebrow="Log"
            title="Engineering log"
            description="Short technical updates. Lab notes, not full posts."
          />
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface/95">
            {log.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-1 p-5 transition-colors hover:bg-surface-hover sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-text-main">
                    {entry.title}
                  </h3>
                  {entry.description ? (
                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {entry.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2 self-start">
                  {entry.dateLabel ? (
                    <span className="text-xs text-text-subtle">{entry.dateLabel}</span>
                  ) : null}
                  <StatusBadge value={entry.status} kind="log" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {experiments.length > 0 ? (
        <section aria-label="Experiments">
          <SectionHeading
            eyebrow="Experiments"
            title="What I'm building or testing"
            description="A grid of in-flight ideas, each with a quick status."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment) => {
              const inner = (
                <>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-text-main">
                      {experiment.title}
                    </h3>
                    {experiment.description ? (
                      <p className="mt-2 text-sm leading-6 text-text-muted">
                        {experiment.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-5">
                    <StatusBadge value={experiment.status} kind="experiment" />
                  </div>
                </>
              );
              const className =
                "flex min-h-36 flex-col justify-between rounded-lg border border-border bg-surface/95 p-5 transition-colors hover:border-accent-indigo/40 hover:bg-surface-hover";
              return experiment.relatedLink ? (
                <a
                  key={experiment.id}
                  href={experiment.relatedLink}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <div key={experiment.id} className={className}>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {principles.length > 0 ? (
        <section aria-label="Engineering principles">
          <SectionHeading
            eyebrow="Principles"
            title="How I like to build"
            description="A short list I come back to when a decision feels heavy."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <li
                key={principle.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-surface/95 p-4 text-sm leading-6 transition-colors hover:border-accent-indigo/40 hover:bg-surface-hover"
              >
                <span className="mt-0.5 font-serif text-sm font-bold text-accent-indigo">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-text-main">{principle.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {categories.length === 0 &&
      workflow.length === 0 &&
      log.length === 0 &&
      experiments.length === 0 &&
      principles.length === 0 ? (
        <section className="rounded-lg border border-border bg-surface/70 p-8 text-center text-text-muted">
          No engineering content yet. Add it from{" "}
          <Link href="/admin/engineering" className="text-accent-indigo hover:underline">
            /admin/engineering
          </Link>
          .
        </section>
      ) : null}
    </PageShell>
  );
}
