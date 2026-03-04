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
};

export type PostListItem = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt: string;
  hasMore: boolean;
};

export type PostDetail = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  html: string;
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
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
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

      return { slug, title, date, author, excerpt, hasMore };
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
  };
}

