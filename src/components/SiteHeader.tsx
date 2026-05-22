"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEARCH_OPEN_EVENT } from "@/components/SearchOverlay";

function subscribe() {
  return () => {};
}

function getShortcut(): string {
  return /mac|iphone|ipod|ipad/i.test(
    navigator.platform || navigator.userAgent,
  )
    ? "⌘K"
    : "Ctrl K";
}

const links = [
  { href: "/", label: "Home", activePaths: ["/"] },
  { href: "/blog", label: "Blog", activePaths: ["/blog", "/posts"] },
  { href: "/projects", label: "Projects", activePaths: ["/projects"] },
  { href: "/cinema", label: "Cinema", activePaths: ["/cinema"] },
  { href: "/radio", label: "Radio", activePaths: ["/radio"] },
  { href: "/podcast", label: "Podcast", activePaths: ["/podcast", "/podcasts"] },
  { href: "/engineering", label: "Engineering", activePaths: ["/engineering"] },
  { href: "/profile", label: "Profile", activePaths: ["/profile", "/album"] },
];

function isActive(pathname: string, activePaths: string[]) {
  return activePaths.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const shortcut = useSyncExternalStore(subscribe, getShortcut, () => null);

  function openSearch() {
    window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
  }

  if (pathname === "/terminal") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="font-serif text-lg font-bold text-text-main transition-opacity hover:opacity-80"
          >
            ISA
          </Link>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <nav
            aria-label="Main navigation"
            className="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 pb-0.5 scrollbar-hide sm:mx-0 sm:px-0 sm:pb-0"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.activePaths);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-surface text-text-main shadow-sm ring-1 ring-inset ring-border"
                      : "text-text-muted hover:bg-surface hover:text-text-main"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={openSearch}
            aria-label="Search posts"
            title="Search posts"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text-main"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {shortcut && (
              <kbd className="hidden md:inline text-[10px] uppercase tracking-wider text-text-subtle">
                {shortcut}
              </kbd>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
