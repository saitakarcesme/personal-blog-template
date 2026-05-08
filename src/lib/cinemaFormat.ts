export type DisplayCinemaType = "movie" | "tv";

export function formatCinemaType(type: DisplayCinemaType) {
  return type === "tv" ? "TV Show" : "Movie";
}

export function formatImdbRating(rating: string) {
  return rating && rating !== "N/A" ? rating : "N/A";
}
