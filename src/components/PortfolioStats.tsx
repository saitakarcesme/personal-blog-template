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
      <div className="portfolio-energy" aria-hidden="true">
        <svg viewBox="0 0 420 260" className="h-full w-full">
          <ellipse
            className="portfolio-energy-halo"
            cx="210"
            cy="132"
            rx="142"
            ry="72"
          />
          <g className="portfolio-energy-ring portfolio-energy-ring-wide">
            <ellipse cx="210" cy="130" rx="168" ry="74" />
            <ellipse cx="210" cy="130" rx="116" ry="48" />
          </g>
          <g className="portfolio-energy-ring portfolio-energy-ring-tilt">
            <ellipse cx="210" cy="130" rx="132" ry="52" />
          </g>
          <path
            className="portfolio-energy-thread"
            d="M58 132c46-46 92-58 138-36s82 22 112 0 48-16 62 32c-42 34-86 45-132 32s-86-10-122 8-54 2-58-36Z"
          />
          <g className="portfolio-energy-dots portfolio-energy-dots-slow">
            <circle cx="86" cy="132" r="2.8" />
            <circle cx="174" cy="78" r="2.4" />
            <circle cx="296" cy="94" r="2.6" />
            <circle cx="342" cy="152" r="2.2" />
            <circle cx="216" cy="182" r="2.7" />
          </g>
          <g className="portfolio-energy-dots portfolio-energy-dots-pulse">
            <circle cx="210" cy="130" r="3.2" />
            <circle cx="244" cy="112" r="2.1" />
            <circle cx="182" cy="146" r="2" />
          </g>
        </svg>
      </div>

      <dl className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 text-center sm:grid-cols-4">
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
