"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchEntry = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt: string;
  text: string;
};

type ScoredResult = {
  entry: SearchEntry;
  snippet: string;
};

export const SEARCH_OPEN_EVENT = "isa:search-open";

const MAX_RESULTS = 8;
const SNIPPET_RADIUS = 70;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSnippet(text: string, query: string): string {
  if (!query) return text.slice(0, SNIPPET_RADIUS * 2);
  const lowerText = text.toLowerCase();
  const idx = lowerText.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, SNIPPET_RADIUS * 2);
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(text.length, idx + query.length + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark
        key={i}
        className="rounded bg-accent/20 px-0.5 text-text-main"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function scoreEntry(entry: SearchEntry, q: string): number {
  const title = entry.title.toLowerCase();
  const text = entry.text.toLowerCase();
  if (title.includes(q)) return title === q ? 3 : 2;
  if (text.includes(q)) return 1;
  return 0;
}

export function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const loadEntries = useCallback(async () => {
    if (entries || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search");
      if (!res.ok) throw new Error("Failed to load search index");
      const data = (await res.json()) as { posts: SearchEntry[] };
      setEntries(data.posts);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [entries, loading]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isModK) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener(SEARCH_OPEN_EVENT, onOpenEvent);
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, onOpenEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadEntries();
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open, loadEntries]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const results: ScoredResult[] = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    if (!q) {
      return entries.slice(0, MAX_RESULTS).map((entry) => ({
        entry,
        snippet: entry.excerpt,
      }));
    }
    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(({ entry }) => ({
        entry,
        snippet: buildSnippet(entry.text, q),
      }));
  }, [entries, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        e.preventDefault();
        router.push(`/posts/${target.entry.slug}`);
        close();
      }
    }
  }

  if (!open) return null;

  const trimmedQuery = query.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search posts"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl ring-1 ring-inset ring-ring">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-text-subtle"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search posts…"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-text-main placeholder:text-text-subtle focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-subtle">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && !entries ? (
            <p className="px-4 py-6 text-sm text-text-muted">Loading…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-muted">
              {trimmedQuery ? "No matches." : "Start typing to search."}
            </p>
          ) : (
            <ul className="py-1">
              {results.map((result, index) => {
                const active = index === activeIndex;
                return (
                  <li key={result.entry.slug}>
                    <Link
                      href={`/posts/${result.entry.slug}`}
                      onClick={close}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        active
                          ? "bg-surface-hover text-text-main"
                          : "text-text-muted hover:bg-surface-hover hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate font-serif text-base font-bold text-text-main">
                          {highlight(result.entry.title, trimmedQuery)}
                        </span>
                        <time className="shrink-0 text-[11px] tabular-nums text-text-subtle">
                          {result.entry.date}
                        </time>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                        {highlight(result.snippet, trimmedQuery)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] uppercase tracking-wider text-text-subtle">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5">↑</kbd>
              <kbd className="rounded border border-border bg-background px-1 py-0.5">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5">↵</kbd>
              <span>open</span>
            </span>
          </div>
          {entries && (
            <span>
              {results.length} of {entries.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
