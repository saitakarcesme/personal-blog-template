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
    title: "Just Building Things: The Start of the ISA Podcast",
    youtubeUrl: "https://www.youtube.com/watch?v=E_3HTrJFdEQ",
    date: "2026-03-24",
  },
];

