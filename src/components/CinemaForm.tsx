"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveCinemaEntry, updateCinemaEntry } from "@/actions/adminActions";
import { formatCinemaType } from "@/lib/cinemaFormat";
import { IsaScoreSlider } from "@/components/IsaScoreSlider";
import { FiCheck, FiLoader, FiSearch } from "react-icons/fi";

type CinemaFormMode = "create" | "edit";

export type CinemaFormData = {
  slug?: string;
  title: string;
  year: string;
  type: "movie" | "tv";
  poster?: string;
  imdbId?: string;
  imdbRating: string;
  isaScore: number;
  watchedDate?: string;
  createdAt?: string;
  content: string;
};

type ImdbResult = {
  imdbId: string;
  title: string;
  year: string;
  type: "movie" | "tv";
  poster: string;
  imdbRating: string;
  plot?: string;
};

const defaultData: CinemaFormData = {
  title: "",
  year: "",
  type: "movie",
  poster: "",
  imdbId: "",
  imdbRating: "N/A",
  isaScore: 75,
  watchedDate: "",
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

export function CinemaForm({
  mode = "create",
  initialData,
}: {
  mode?: CinemaFormMode;
  initialData?: CinemaFormData;
}) {
  const data = initialData ?? defaultData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchPending, startSearchTransition] = useTransition();

  const [search, setSearch] = useState(data.title);
  const [results, setResults] = useState<ImdbResult[]>([]);
  const [searchError, setSearchError] = useState("");
  const [selectedId, setSelectedId] = useState(data.imdbId ?? "");

  const [title, setTitle] = useState(data.title);
  const [year, setYear] = useState(data.year);
  const [type, setType] = useState<"movie" | "tv">(data.type);
  const [poster, setPoster] = useState(data.poster ?? "");
  const [imdbId, setImdbId] = useState(data.imdbId ?? "");
  const [imdbRating, setImdbRating] = useState(data.imdbRating || "N/A");
  const [isaScore, setIsaScore] = useState(data.isaScore);
  const [watchedDate, setWatchedDate] = useState(data.watchedDate ?? "");
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
            `/api/imdb/search?q=${encodeURIComponent(query)}`,
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

  function applyResult(result: ImdbResult) {
    setSelectedId(result.imdbId);
    setTitle(result.title);
    setYear(result.year);
    setType(result.type);
    setPoster(result.poster);
    setImdbId(result.imdbId);
    setImdbRating(result.imdbRating || "N/A");

    if (!slugTouched) {
      setSlug(slugify(`${result.title} ${result.year}`));
    }

    startSearchTransition(async () => {
      try {
        const response = await fetch(`/api/imdb/title/${result.imdbId}`);
        const payload = await response.json();

        if (!response.ok || !payload.result) return;

        const detail = payload.result as ImdbResult;
        setPoster(detail.poster || result.poster);
        setImdbRating(detail.imdbRating || result.imdbRating || "N/A");
      } catch {
        // The selected search result is still usable if details fail.
      }
    });
  }

  function handleSubmit(formData: FormData) {
    setFormError("");
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && initialData?.slug
            ? await updateCinemaEntry(initialData.slug, formData)
            : await saveCinemaEntry(formData);

        router.push(`/admin/cinema/edit/${result.slug}`);
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
          htmlFor="imdb-search"
          className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-subtle"
        >
          <FiSearch />
          Search IMDb
        </label>
        <input
          id="imdb-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search movies or TV shows..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
        />

        <div className="mt-4">
          {searchPending ? (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <FiLoader className="animate-spin" />
              Searching imdbapi.dev...
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
                  key={result.imdbId}
                  type="button"
                  onClick={() => applyResult(result)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition hover:bg-surface-hover ${
                    selectedId === result.imdbId
                      ? "border-accent/60 bg-surface-hover"
                      : "border-border bg-background/50"
                  }`}
                >
                  {result.poster ? (
                    <img
                      src={result.poster}
                      alt=""
                      className="h-16 w-11 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <span className="h-16 w-11 shrink-0 rounded bg-surface-hover" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-base font-bold text-text-main">
                      {result.title}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-widest text-text-subtle">
                      {formatCinemaType(result.type)} {result.year || "N/A"} -
                      IMDb {result.imdbRating || "N/A"}
                    </span>
                  </span>
                  {selectedId === result.imdbId ? (
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
          {poster ? (
            <img
              src={poster}
              alt=""
              className="aspect-[2/3] w-full rounded-lg border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg border border-border bg-background text-center text-xs uppercase tracking-widest text-text-subtle">
              No Poster
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
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
                required
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

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
                onChange={(event) => setType(event.target.value as "movie" | "tv")}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              IMDb Rating
              <input
                name="imdbRating"
                value={imdbRating}
                onChange={(event) => setImdbRating(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-text-muted">
              IMDb ID
              <input
                name="imdbId"
                value={imdbId}
                onChange={(event) => setImdbId(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>

            <label className="grid gap-2 text-sm text-text-muted">
              Watched Date
              <input
                name="watchedDate"
                type="date"
                value={watchedDate}
                onChange={(event) => setWatchedDate(event.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-text-muted">
            Poster URL
            <input
              name="poster"
              value={poster}
              onChange={(event) => setPoster(event.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-main outline-none focus:border-accent/50"
            />
          </label>
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
            placeholder="Write the full Cinema opinion..."
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
              ? "Update Cinema Entry"
              : "Save Cinema Entry"}
        </button>
      </div>
    </form>
  );
}
