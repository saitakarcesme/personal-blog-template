import { MeteorShower } from "./MeteorShower";

type StatItem = {
  label: string;
  value: number;
};

export function PortfolioStats({ stats }: { stats: StatItem[] }) {
  return (
    <section
      aria-label="Portfolio totals"
      className="relative isolate overflow-hidden py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <MeteorShower className="h-full w-full" />
      </div>

      <dl className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 text-center sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <dt className="mb-4 text-sm text-text-muted">{stat.label}</dt>
            <dd className="font-serif text-5xl font-semibold leading-none text-text-main sm:text-6xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
