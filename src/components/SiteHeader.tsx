"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      </div>
    </header>
  );
}
