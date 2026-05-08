import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type CinemaType = "movie" | "tv";

export type CinemaFrontmatter = {
  title: string;
  slug?: string;
  year?: string | number;
  type: CinemaType;
  poster?: string;
  imdbId?: string;
  imdbRating?: string | number;
  isaScore: number;
  watchedDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CinemaListItem = {
  slug: string;
  title: string;
  year: string;
  type: CinemaType;
  poster?: string;
  imdbId?: string;
  imdbRating: string;
  isaScore: number;
  watchedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  excerpt: string;
  hasMore: boolean;
};

export type CinemaDetail = CinemaListItem & {
  html: string;
  content: string;
};

const cinemaDir = path.join(process.cwd(), "data", "cinema");

function isMarkdownFile(fileName: string) {
  return fileName.toLowerCase().endsWith(".md");
}

export function getCinemaSlugs(): string[] {
  if (!fs.existsSync(cinemaDir)) return [];
  return fs.readdirSync(cinemaDir).filter(isMarkdownFile);
}

export function getCinemaSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

function normalizeType(type: unknown): CinemaType {
  return type === "tv" ? "tv" : "movie";
}

function normalizeRating(value: unknown): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

function normalizeYear(value: unknown): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

function clampScore(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(markdownContent: string, maxChars = 220) {
  const plain = toPlainText(markdownContent);
  if (plain.length <= maxChars) {
    return { excerpt: plain, hasMore: false };
  }

  const trimmed = plain.slice(0, maxChars).trimEnd();
  return { excerpt: `${trimmed}...`, hasMore: true };
}

function mapEntry(
  fileName: string,
  frontmatter: Partial<CinemaFrontmatter>,
  content: string,
): CinemaListItem {
  const fallbackSlug = getCinemaSlugFromFileName(fileName);
  const { excerpt, hasMore } = buildExcerpt(content);

  return {
    slug: frontmatter.slug || fallbackSlug,
    title: frontmatter.title || fallbackSlug,
    year: normalizeYear(frontmatter.year),
    type: normalizeType(frontmatter.type),
    poster: frontmatter.poster || undefined,
    imdbId: frontmatter.imdbId || undefined,
    imdbRating: normalizeRating(frontmatter.imdbRating),
    isaScore: clampScore(frontmatter.isaScore),
    watchedDate: frontmatter.watchedDate || undefined,
    createdAt: frontmatter.createdAt || undefined,
    updatedAt: frontmatter.updatedAt || undefined,
    excerpt,
    hasMore,
  };
}

export function getAllCinemaEntries(): CinemaListItem[] {
  const slugs = getCinemaSlugs();

  return slugs
    .map((fileName) => {
      const fullPath = path.join(cinemaDir, fileName);
      const file = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(file);

      return mapEntry(fileName, data as Partial<CinemaFrontmatter>, content);
    })
    .sort((a, b) => {
      const aDate = a.watchedDate || a.updatedAt || a.createdAt || "";
      const bDate = b.watchedDate || b.updatedAt || b.createdAt || "";
      if (aDate < bDate) return 1;
      if (aDate > bDate) return -1;
      return a.title.localeCompare(b.title);
    });
}

export async function getCinemaEntryBySlug(
  slug: string,
): Promise<CinemaDetail | null> {
  const fullPath = path.join(cinemaDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const base = mapEntry(`${slug}.md`, data as Partial<CinemaFrontmatter>, content);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    ...base,
    html: processed.toString(),
    content: content.trim(),
  };
}
