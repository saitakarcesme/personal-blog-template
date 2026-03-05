export type PodcastEpisode = {
  episode: number;
  title: string;
  /** Any YouTube URL format (watch, youtu.be, shorts, etc.). */
  youtubeUrl: string;
  /** ISO date string: YYYY-MM-DD (optional but recommended). */
  date?: string;
};

/**
 * Add new episodes here.
 * The homepage will automatically render them in ascending episode order.
 */
export const podcastEpisodes: PodcastEpisode[] = [
  {
    episode: 1,
    title: "Episode 1 — Welcome",
    youtubeUrl: "https://www.youtube.com/watch?v=bA6A-MzzMtY",
    date: "2026-01-01",
  },


];

