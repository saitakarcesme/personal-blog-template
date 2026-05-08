"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveRadioEntry, updateRadioEntry } from "@/actions/adminActions";
import { IsaScoreSlider } from "@/components/IsaScoreSlider";
import { formatRadioType } from "@/lib/radioFormat";
import { FiCheck, FiLoader, FiSearch } from "react-icons/fi";

type RadioFormMode = "create" | "edit";

export type RadioFormData = {
  slug?: string;
  title: string;
  artist: string;
  year: string;
  type: "song" | "album" | "playlist";
  cover?: string;
  sourceId?: string;
  sourceUrl?: string;
  isaScore: number;
  mood?: string;
  listenedDate?: string;
  createdAt?: string;
  content: string;
};

type MusicResult = {
  sourceId: string;
  title: string;
  artist: string;
  year: string;
  type: "song" | "album";
  cover: string;
  sourceUrl: string;
};

const defaultData: RadioFormData = {
  title: "",
  artist: "",
  year: "",
  type: "song",
  cover: "",
  sourceId: "",
  sourceUrl: "",
  isaScore: 75,
  mood: "",
  listenedDate: "",
  content: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RadioForm({
  mode = "create",
  initialData,
}: {
  mode?: RadioFormMode;
  initialData?: RadioFormData;
}) {
  const data = initialData ?? defaultData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchPending, startSearchTransition] = useTransition();

  const [search, setSearch] = useState(data.title);
  const [results, setResults] = useState<MusicResult[]>([]);
  const [searchError, setSearchError] = useState("");
  const [selectedId, setSelectedId] = useState(data.sourceId ?? "");

  const [title, setTitle] = useState(data.title);
  const [artist, setArtist] = useState(data.artist);
  const [year, setYear] = useState(data.year);
  const [type, setType] = useState<"song" | "album" | "playlist">(data.type);
  const [cover, setCover] = useState(data.cover ?? "");
  const [sourceId, setSourceId] = useState(data.sourceId ?? "");
  const [sourceUrl, setSourceUrl] = useState(data.sourceUrl ?? "");
  const [isaScore, setIsaScore] = useState(data.isaScore);
  const [mood, setMood] = useState(data.mood ?? "");
  const [listenedDate, setListenedDate] = useState(data.listenedDate ?? "");
  const [slug, setSlug] = useState(data.slug ?? slugify(data.title));
  const [slugTouched, setSlugTouched] = useState(Boolean(data.slug));
  const [review, setReview] = useState(data.content);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setResults([]);
      setSearchError("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      startSearchTransition(async () => {
        try {
          setSearchError("");
          const response = await fetch(
            `/api/music/search?q=${encodeURIComponent(query)}`,
            { signal: controller.signal },
          );
          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload.error || "Search failed.");
          }

          setResults(payload.results ?? []);
        } catch (error) {
          if (controller.signal.aborted) return;
          setResults([]);
          setSearchError(
            error instanceof Error ? error.message : "Search failed.",
          );
        }
      });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  function applyResult(result: MusicResult) {
    setSelectedId(result.sourceId);
    setTitle(result.title);
    setArtist(result.artist);
    setYear(result.year);
    setType(result.type);
    setCover(result.cover);
    setSourceId(result.sourceId);
    setSourceUrl(result.sourceUrl);

    if (!slugTouched) {
      setSlug(slugify(`${result.title} ${result.artist} ${result.year}`));
    }
  }

  function updateSlug(nextTitle: string, nextArtist = artist) {
    if (!slugTouched) {
      setSlug(slugify(`${nextTitle} ${nextArtist}`));
    }
  }

  function handleSubmit(formData: FormData) {
    setFormError("");
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && initialData?.slug
            ? await updateRadioEntry(initialData.slug, formData)
            : await saveRadioEntry(formData);

        router.push(`/admin/radio/edit/${result.slug}`);
        router.refresh();
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Failed to save entry.",
        );
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <input type="hidden" name="createdAt" value={data.createdAt ?? ""} />

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <label
          htmlFor="music-search"
          className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-subtle"
        >
          <FiSearch />
          Music Search
        </label>
        <input
          id="music-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search songs or albums..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        />

        <div className="mt-4">
          {searchPending ? (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <FiLoader className="animate-spin" />
              Searching iTunes...
            </p>
          ) : searchError ? (
            <p className="text-sm text-red-400">{searchError}</p>
          ) : search.trim().length >= 2 && results.length === 0 ? (
            <p className="text-sm text-text-muted">No matches found.</p>
          ) : null}

          {results.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {results.map((result) => (
                <button
                  key={result.sourceId}
                  type="button"
                  onClick={() => applyResult(result)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition hover:bg-surface-hover ${
                    selectedId === result.sourceId
                      ? "border-accent/60 bg-surface-hover"
                      : "border-border bg-background/50"
                  }`}
                >
                  {result.cover ? (
                    <img
                      src={result.cover}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <span className="h-16 w-16 shrink-0 rounded bg-surface-hover" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-base font-bold text-text-main">
                      {result.title}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-widest text-text-subtle">
                      {formatRadioType(result.type)} {result.year || "N/A"} -
                      {result.artist}
                    </span>
                  </span>
                  {selectedId === result.sourceId ? (
                    <FiCheck className="shrink-0 text-accent" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:p-6">
        <div className="min-w-0">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="aspect-square w-full rounded-lg border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-background text-center text-xs uppercase tracking-widest text-text-subtle">
              No Cover
            </div>
          )}
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-text-muted">
              Title
              <input
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  updateSlug(event.target.value);
                }}
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              Artist
              <input
                name="artist"
                value={artist}
                onChange={(event) => {
                  setArtist(event.target.value);
                  updateSlug(title, event.target.value);
                }}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="grid gap-2 text-sm text-text-muted">
              Year
              <input
                name="year"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              Type
              <select
                name="type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "song" | "album" | "playlist")
                }
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              >
                <option value="song">Song</option>
                <option value="album">Album</option>
                <option value="playlist">Playlist</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              Mood
              <input
                name="mood"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-text-muted">
              Slug
              <input
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              Listened Date
              <input
                name="listenedDate"
                type="date"
                value={listenedDate}
                onChange={(event) => setListenedDate(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-text-muted">
            Cover Image URL
            <input
              name="cover"
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-text-muted">
              External Source ID
              <input
                name="sourceId"
                value={sourceId}
                onChange={(event) => setSourceId(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              External URL
              <input
                name="sourceUrl"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>
        </div>
      </section>

      <IsaScoreSlider value={isaScore} onChange={setIsaScore} />

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <label className="grid gap-2 text-sm text-text-muted">
          Review / Opinion
          <textarea
            name="review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            required
            rows={12}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 font-serif text-base leading-7 text-text-main outline-none focus:border-accent/50"
            placeholder="Write the full Radio opinion..."
          />
        </label>
      </section>

      {formError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-bold text-background shadow-md transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : mode === "edit"
              ? "Update Radio Entry"
              : "Save Radio Entry"}
        </button>
      </div>
    </form>
  );
}
