export type MusicLookupItem = {
  sourceId: string;
  title: string;
  artist: string;
  year: string;
  type: "song" | "album";
  cover: string;
  sourceUrl: string;
};

type ItunesResult = {
  wrapperType?: string;
  kind?: string;
  collectionType?: string;
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
};

const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";

function largerArtwork(url?: string) {
  if (!url) return "";
  return url.replace(/\/\d+x\d+bb\./, "/600x600bb.");
}

function releaseYear(releaseDate?: string) {
  return releaseDate ? releaseDate.slice(0, 4) : "";
}

function normalizeResult(
  result: ItunesResult,
  type: "song" | "album",
): MusicLookupItem | null {
  const sourceId =
    type === "song" ? result.trackId ?? result.collectionId : result.collectionId;
  const title = type === "song" ? result.trackName : result.collectionName;

  if (!sourceId || !title) return null;

  return {
    sourceId: `${type}:${sourceId}`,
    title,
    artist: result.artistName || "Unknown Artist",
    year: releaseYear(result.releaseDate),
    type,
    cover: largerArtwork(result.artworkUrl100),
    sourceUrl:
      type === "song"
        ? result.trackViewUrl || result.collectionViewUrl || ""
        : result.collectionViewUrl || "",
  };
}

async function searchItunesEntity(query: string, entity: "song" | "album") {
  const params = new URLSearchParams({
    term: query,
    media: "music",
    entity,
    limit: "10",
  });

  const response = await fetch(`${ITUNES_SEARCH_URL}?${params.toString()}`, {
    headers: { accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`iTunes search failed with ${response.status}`);
  }

  const payload = (await response.json()) as { results?: ItunesResult[] };
  return (payload.results ?? [])
    .map((result) => normalizeResult(result, entity))
    .filter((item): item is MusicLookupItem => Boolean(item));
}

export async function searchMusic(query: string, limit = 10) {
  const [songs, albums] = await Promise.all([
    searchItunesEntity(query, "song"),
    searchItunesEntity(query, "album"),
  ]);

  const seen = new Set<string>();
  const merged: MusicLookupItem[] = [];

  for (const item of [...songs, ...albums]) {
    if (seen.has(item.sourceId)) continue;
    seen.add(item.sourceId);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}
