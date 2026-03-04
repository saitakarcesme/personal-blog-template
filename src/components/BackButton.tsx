"use client";

import Link from "next/link";
import { useThemeClasses } from "./useThemeClasses";

export function BackButton({ href = "/" }: { href?: string }) {
  const tc = useThemeClasses();

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tc.socialBtn}`}
    >
      <span aria-hidden>←</span>
      Back
    </Link>
  );
}
