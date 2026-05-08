export type ImdbApiTitle = {
  id?: string;
  type?: string;
  primaryTitle?: string;
  originalTitle?: string;
  primaryImage?: {
    url?: string;
    width?: number;
    height?: number;
  } | null;
  startYear?: number;
  rating?: {
    aggregateRating?: number;
    voteCount?: number;
  } | null;
  plot?: string;
};

export type ImdbLookupItem = {
  imdbId: string;
  title: string;
  year: string;
  type: "movie" | "tv";
  poster: string;
  imdbRating: string;
  plot?: string;
};

const IMDB_API_BASE_URL = "https://api.imdbapi.dev";

function toIsaType(type?: string): "movie" | "tv" {
  return type?.toLowerCase().startsWith("tv") ? "tv" : "movie";
}

function normalizeTitle(title: ImdbApiTitle): ImdbLookupItem | null {
  if (!title.id || !title.primaryTitle) return null;
  const titleType = title.type?.toLowerCase() ?? "";
  if (titleType !== "movie" && !titleType.startsWith("tv")) return null;

  return {
    imdbId: title.id,
    title: title.primaryTitle,
    year: title.startYear ? String(title.startYear) : "",
    type: toIsaType(title.type),
    poster: title.primaryImage?.url || "",
    imdbRating:
      title.rating?.aggregateRating !== undefined
        ? String(title.rating.aggregateRating)
        : "N/A",
    plot: title.plot,
  };
}

async function imdbFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${IMDB_API_BASE_URL}${path}`, {
    headers: {
      accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`imdbapi.dev request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchImdbTitles(query: string, limit = 8) {
  const data = await imdbFetch<{ titles?: ImdbApiTitle[] }>(
    `/search/titles?query=${encodeURIComponent(query)}&limit=${limit}`,
  );

  return (data.titles ?? [])
    .map(normalizeTitle)
    .filter((title): title is ImdbLookupItem => Boolean(title));
}

export async function getImdbTitleById(id: string) {
  const data = await imdbFetch<ImdbApiTitle>(
    `/titles/${encodeURIComponent(id)}`,
  );

  return normalizeTitle(data);
}
