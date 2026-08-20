"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCode, FiEdit3, FiGrid, FiHome, FiImage, FiMic, FiUser } from "react-icons/fi";

const navItems = [
  { label: "Home", href: "/", icon: FiHome, match: (path: string) => path === "/" },
  { label: "Blog", href: "/posts", icon: FiEdit3, match: (path: string) => path.startsWith("/posts") },
  { label: "Podcast", href: "/podcasts", icon: FiMic, match: (path: string) => path.startsWith("/podcasts") },
  { label: "Album", href: "/album", icon: FiImage, match: (path: string) => path.startsWith("/album") },
  { label: "Projects", href: "/projects", icon: FiCode, match: (path: string) => path.startsWith("/projects") },
  { label: "Profile", href: "/profile", icon: FiUser, match: (path: string) => path.startsWith("/profile") },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-[9000] border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 pr-16 sm:px-6 sm:pr-20 xl:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-surface">
            <Image src="/profilepic.jpeg" alt="Ibrahim Sait Akarcesme" fill className="object-cover" priority />
          </span>
          <span className="hidden text-sm font-semibold text-text-main sm:block">
            ISA
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-text-main bg-text-main text-background"
                    : "border-transparent text-text-muted hover:bg-surface-hover hover:text-text-main"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin"
          className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-border px-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text-main lg:inline-flex"
        >
          <FiGrid className="h-4 w-4" aria-hidden />
          Admin
        </Link>
      </div>
    </header>
  );
}
