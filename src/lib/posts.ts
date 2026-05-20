import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type PostFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  author?: string;
  image?: string;
};

export type PostListItem = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt: string;
  hasMore: boolean;
  coverImage?: string | null;
  readingTimeMinutes: number;
};

export type PostDetail = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  html: string;
  readingTimeMinutes: number;
};

export type PostSearchEntry = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt: string;
  text: string;
};

const postsDir = path.join(process.cwd(), "data", "posts");

function isMarkdownFile(fileName: string) {
  return fileName.toLowerCase().endsWith(".md");
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(isMarkdownFile);
}

export function getPostSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
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

function buildExcerpt(markdownContent: string, maxChars = 400) {
  const plain = toPlainText(markdownContent);
  if (plain.length <= maxChars) {
    return { excerpt: plain, hasMore: false };
  }
  const trimmed = plain.slice(0, maxChars).trimEnd();
  return { excerpt: `${trimmed}…`, hasMore: true };
}

function extractFirstImage(markdownContent: string): string | null {
  const match = markdownContent.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
}

const WORDS_PER_MINUTE = 200;

export function estimateReadingTimeMinutes(markdownContent: string): number {
  const plain = toPlainText(markdownContent);
  if (!plain) return 1;
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export function getAllPosts(): PostListItem[] {
  const slugs = getPostSlugs();

  const posts = slugs
    .map((fileName) => {
      const slug = getPostSlugFromFileName(fileName);
      const fullPath = path.join(postsDir, fileName);
      const file = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(file);

      const fm = data as Partial<PostFrontmatter>;
      const title = fm.title ?? slug;
      const date = fm.date ?? "1970-01-01";
      const author = fm.author;
      const { excerpt, hasMore } = buildExcerpt(content);
      const coverImage = fm.image || extractFirstImage(content);
      const readingTimeMinutes = estimateReadingTimeMinutes(content);

      return { slug, title, date, author, excerpt, hasMore, coverImage, readingTimeMinutes };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return posts;
}

export async function getPostDetail(slug: string): Promise<PostDetail | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const fm = data as Partial<PostFrontmatter>;

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: fm.title ?? slug,
    date: fm.date ?? "1970-01-01",
    author: fm.author,
    html: processed.toString(),
    readingTimeMinutes: estimateReadingTimeMinutes(content),
  };
}

export function getAllPostsForSearch(): PostSearchEntry[] {
  const slugs = getPostSlugs();

  return slugs
    .map((fileName) => {
      const slug = getPostSlugFromFileName(fileName);
      const fullPath = path.join(postsDir, fileName);
      const file = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(file);
      const fm = data as Partial<PostFrontmatter>;

      const { excerpt } = buildExcerpt(content, 240);

      return {
        slug,
        title: fm.title ?? slug,
        date: fm.date ?? "1970-01-01",
        author: fm.author,
        excerpt,
        text: toPlainText(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

