"use client";

import Link from "next/link";

export function BackButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-hover shadow-sm"
    >
      <span aria-hidden>←</span>
      Back
    </Link>
  );
}
