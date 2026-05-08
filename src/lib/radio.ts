import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type RadioType = "song" | "album" | "playlist";

export type RadioFrontmatter = {
  title: string;
  slug?: string;
  artist?: string;
  year?: string | number;
  type: RadioType;
  cover?: string;
  sourceId?: string;
  sourceUrl?: string;
  isaScore: number;
  mood?: string;
  listenedDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RadioListItem = {
  slug: string;
  title: string;
  artist: string;
  year: string;
  type: RadioType;
  cover?: string;
  sourceId?: string;
  sourceUrl?: string;
  isaScore: number;
  mood?: string;
  listenedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  excerpt: string;
  hasMore: boolean;
};

export type RadioDetail = RadioListItem & {
  html: string;
  content: string;
};

const radioDir = path.join(process.cwd(), "data", "radio");

function isMarkdownFile(fileName: string) {
  return fileName.toLowerCase().endsWith(".md");
}

export function getRadioSlugs(): string[] {
  if (!fs.existsSync(radioDir)) return [];
  return fs.readdirSync(radioDir).filter(isMarkdownFile);
}

export function getRadioSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

function normalizeType(type: unknown): RadioType {
  if (type === "album" || type === "playlist") return type;
  return "song";
}

function normalizeText(value: unknown, fallback = "N/A"): string {
  if (value === null || value === undefined || value === "") return fallback;
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
  frontmatter: Partial<RadioFrontmatter>,
  content: string,
): RadioListItem {
  const fallbackSlug = getRadioSlugFromFileName(fileName);
  const { excerpt, hasMore } = buildExcerpt(content);

  return {
    slug: frontmatter.slug || fallbackSlug,
    title: frontmatter.title || fallbackSlug,
    artist: normalizeText(frontmatter.artist, "Unknown Artist"),
    year: normalizeText(frontmatter.year),
    type: normalizeType(frontmatter.type),
    cover: frontmatter.cover || undefined,
    sourceId: frontmatter.sourceId || undefined,
    sourceUrl: frontmatter.sourceUrl || undefined,
    isaScore: clampScore(frontmatter.isaScore),
    mood: frontmatter.mood || undefined,
    listenedDate: frontmatter.listenedDate || undefined,
    createdAt: frontmatter.createdAt || undefined,
    updatedAt: frontmatter.updatedAt || undefined,
    excerpt,
    hasMore,
  };
}

export function getAllRadioEntries(): RadioListItem[] {
  const slugs = getRadioSlugs();

  return slugs
    .map((fileName) => {
      const fullPath = path.join(radioDir, fileName);
      const file = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(file);

      return mapEntry(fileName, data as Partial<RadioFrontmatter>, content);
    })
    .sort((a, b) => {
      const aDate = a.listenedDate || a.updatedAt || a.createdAt || "";
      const bDate = b.listenedDate || b.updatedAt || b.createdAt || "";
      if (aDate < bDate) return 1;
      if (aDate > bDate) return -1;
      return a.title.localeCompare(b.title);
    });
}

export async function getRadioEntryBySlug(
  slug: string,
): Promise<RadioDetail | null> {
  const fullPath = path.join(radioDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const base = mapEntry(`${slug}.md`, data as Partial<RadioFrontmatter>, content);

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
