"use client";

import type { ReactNode } from "react";

export function Column({
  title,
  children,
  className,
  scrollable,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  const baseClass = "bg-surface border border-border rounded-xl p-5 shadow-sm";
  const sectionClass = scrollable
    ? `flex min-[1300px]:min-h-0 flex-col min-[1300px]:overflow-hidden ${className ?? ""}`
    : className ?? "";

  return (
    <section className={sectionClass}>
      {title ? (
        <h2 className="mb-6 shrink-0 text-3xl font-bold uppercase tracking-widest text-text-main">
          {title}
        </h2>
      ) : null}
      {scrollable ? (
        <div className="scrollbar-hide min-[1300px]:min-h-0 flex-1 min-[1300px]:overflow-y-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
