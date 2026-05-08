"use client";

import { useMemo } from "react";

export function IsaScoreSlider({
  value,
  onChange,
  id = "isa-score",
  name = "isaScore",
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  name?: string;
}) {
  const scoreFill = useMemo(
    () => ({
      background: `linear-gradient(90deg, rgba(237,237,237,0.95) ${value}%, rgba(255,255,255,0.12) ${value}%)`,
    }),
    [value],
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label
            htmlFor={id}
            className="text-xs font-bold uppercase tracking-wider text-text-subtle"
          >
            ISA Score
          </label>
          <p className="mt-2 font-serif text-5xl font-semibold leading-none text-text-main">
            {value}
            <span className="ml-1 text-lg text-text-muted">/100</span>
          </p>
        </div>
      </div>

      <input
        id={id}
        name={name}
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={scoreFill}
        className="mt-6 h-3 w-full cursor-pointer appearance-none rounded-full border border-border bg-background accent-accent"
        aria-valuetext={`${value} out of 100`}
      />
    </section>
  );
}
