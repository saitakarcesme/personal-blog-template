import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type ProjectFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  githubUrl: string;
};

export type ProjectListItem = {
  slug: string;
  title: string;
  date: string;
  githubUrl: string;
  excerpt: string;
  hasMore: boolean;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  date: string;
  githubUrl: string;
  html: string;
};

const projectsDir = path.join(process.cwd(), "data", "projects");

function isMarkdownFile(fileName: string) {
  return fileName.toLowerCase().endsWith(".md");
}

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDir)) return [];
  return fs.readdirSync(projectsDir).filter(isMarkdownFile);
}

export function getProjectSlugFromFileName(fileName: string): string {
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

export function getAllProjects(): ProjectListItem[] {
  const slugs = getProjectSlugs();

  const projects = slugs
    .map((fileName) => {
      const slug = getProjectSlugFromFileName(fileName);
      const fullPath = path.join(projectsDir, fileName);
      const file = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(file);

      const fm = data as Partial<ProjectFrontmatter>;
      const title = fm.title ?? slug;
      const date = fm.date ?? "1970-01-01";
      const githubUrl = fm.githubUrl ?? "";
      const { excerpt, hasMore } = buildExcerpt(content);

      return { slug, title, date, githubUrl, excerpt, hasMore };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return projects;
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const fullPath = path.join(projectsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const fm = data as Partial<ProjectFrontmatter>;

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: fm.title ?? slug,
    date: fm.date ?? "1970-01-01",
    githubUrl: fm.githubUrl ?? "",
    html: processed.toString(),
  };
}
