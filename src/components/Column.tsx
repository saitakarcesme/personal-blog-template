"use client";

import type { ReactNode } from "react";
import { useThemeClasses } from "./useThemeClasses";

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
  const tc = useThemeClasses();

  const baseClass = tc.card;
  const sectionClass = scrollable
    ? `${baseClass} flex min-[1300px]:min-h-0 flex-col min-[1300px]:overflow-hidden ${className ?? ""}`
    : `${baseClass} ${className ?? ""}`;

  return (
    <section className={sectionClass}>
      {title ? (
        <h2 className={`mb-4 shrink-0 text-center text-2xl tracking-wide ${tc.title}`}>
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
