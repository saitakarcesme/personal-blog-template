import Link from "next/link";
import React from "react";
import { FiHome, FiEdit3, FiGrid, FiMic, FiRadio } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative z-0 overflow-hidden">
      {/* Antigravity-Style Animated Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
        {/* Shifting top glow */}
        <div className="absolute left-1/2 top-0 w-[1000px] h-[300px] rounded-full bg-accent blur-[120px] animate-glow-drift mix-blend-screen"></div>
        {/* Static mask container for infinite grid */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
            <div className="absolute -inset-[24px] bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-scroll"></div>
        </div>
      </div>

      <header className="sticky top-0 z-10 backdrop-blur-md bg-surface/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif font-bold text-xl text-text-main flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FiRadio className="text-accent" />
            Workspace
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-text-muted">
            <Link href="/admin/posts/new" className="hover:text-text-main transition-colors flex items-center gap-1.5"><FiEdit3 /> Post</Link>
            <Link href="/admin/projects/new" className="hover:text-text-main transition-colors flex items-center gap-1.5"><FiGrid /> Project</Link>
            <Link href="/admin/podcasts/new" className="hover:text-text-main transition-colors flex items-center gap-1.5"><FiMic /> Podcast</Link>
            <div className="w-[1px] h-4 bg-border mx-2"></div>
            <Link href="/" className="hover:text-text-main transition-colors flex items-center gap-1.5" target="_blank"><FiHome /> Live Site</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
