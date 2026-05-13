import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export const ITEM_STATUSES = [
  "Active",
  "Testing",
  "Archived",
  "Planned",
  "Occasional",
] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const EXPERIMENT_STATUSES = [
  "Planned",
  "Testing",
  "Active",
  "Archived",
] as const;
export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];

export const LOG_STATUSES = [
  "Shipped",
  "Ongoing",
  "Planned",
  "Testing",
  "Archived",
] as const;
export type LogStatus = (typeof LOG_STATUSES)[number];

export type EngineeringHero = {
  label: string;
  title: string;
  subtitle: string;
};

export type EngineeringCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  visible: boolean;
};

export type EngineeringWorkflowStep = {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
  order: number;
  visible: boolean;
};

export type EngineeringLogEntry = {
  id: string;
  title: string;
  description: string;
  status: LogStatus | string;
  dateLabel: string;
  order: number;
  visible: boolean;
};

export type EngineeringExperiment = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus | string;
  relatedLink: string;
  order: number;
  visible: boolean;
};

export type EngineeringPrinciple = {
  id: string;
  text: string;
  order: number;
  visible: boolean;
};

export type EngineeringContent = {
  hero: EngineeringHero;
  categories: EngineeringCategory[];
  workflow: EngineeringWorkflowStep[];
  log: EngineeringLogEntry[];
  experiments: EngineeringExperiment[];
  principles: EngineeringPrinciple[];
};

export type EngineeringSpec = { key: string; value: string };

export type EngineeringItemFrontmatter = {
  title: string;
  slug?: string;
  category: string;
  shortDescription?: string;
  useCase?: string;
  status?: ItemStatus | string;
  specs?: EngineeringSpec[];
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EngineeringItemSummary = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  useCase: string;
  status: string;
  specs: EngineeringSpec[];
  imageUrl: string;
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EngineeringItemDetail = EngineeringItemSummary & {
  content: string;
  html: string;
};

const engineeringDir = path.join(process.cwd(), "data", "engineering");
const itemsDir = path.join(engineeringDir, "items");
const contentFile = path.join(engineeringDir, "content.json");

const DEFAULT_HERO: EngineeringHero = {
  label: "Engineering",
  title: "Engineering",
  subtitle: "My setup, coding workflow, experiments, and technical notes.",
};

function safeReadJson(): EngineeringContent {
  if (!fs.existsSync(contentFile)) {
    return {
      hero: DEFAULT_HERO,
      categories: [],
      workflow: [],
      log: [],
      experiments: [],
      principles: [],
    };
  }
  try {
    const raw = fs.readFileSync(contentFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<EngineeringContent>;
    return {
      hero: { ...DEFAULT_HERO, ...(parsed.hero ?? {}) },
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      workflow: Array.isArray(parsed.workflow) ? parsed.workflow : [],
      log: Array.isArray(parsed.log) ? parsed.log : [],
      experiments: Array.isArray(parsed.experiments) ? parsed.experiments : [],
      principles: Array.isArray(parsed.principles) ? parsed.principles : [],
    };
  } catch {
    return {
      hero: DEFAULT_HERO,
      categories: [],
      workflow: [],
      log: [],
      experiments: [],
      principles: [],
    };
  }
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function getEngineeringContent(): EngineeringContent {
  const data = safeReadJson();
  return {
    hero: data.hero,
    categories: sortByOrder(data.categories),
    workflow: sortByOrder(data.workflow),
    log: sortByOrder(data.log),
    experiments: sortByOrder(data.experiments),
    principles: sortByOrder(data.principles),
  };
}

export function getVisibleEngineeringContent(): EngineeringContent {
  const data = getEngineeringContent();
  return {
    hero: data.hero,
    categories: data.categories.filter((c) => c.visible !== false),
    workflow: data.workflow.filter((w) => w.visible !== false),
    log: data.log.filter((l) => l.visible !== false),
    experiments: data.experiments.filter((e) => e.visible !== false),
    principles: data.principles.filter((p) => p.visible !== false),
  };
}

function normalizeSpecs(specs: unknown): EngineeringSpec[] {
  if (!Array.isArray(specs)) return [];
  return specs
    .map((s) => {
      if (typeof s !== "object" || s === null) return null;
      const obj = s as Record<string, unknown>;
      const key = typeof obj.key === "string" ? obj.key : "";
      const value = typeof obj.value === "string" ? obj.value : "";
      if (!key) return null;
      return { key, value };
    })
    .filter((s): s is EngineeringSpec => s !== null);
}

function mapItem(
  fileName: string,
  data: Partial<EngineeringItemFrontmatter>,
): EngineeringItemSummary {
  const fallbackSlug = fileName.replace(/\.md$/i, "");
  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    category: data.category || "",
    shortDescription: data.shortDescription || "",
    useCase: data.useCase || "",
    status: (data.status as string) || "",
    specs: normalizeSpecs(data.specs),
    imageUrl: data.imageUrl || "",
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 100,
    visible: data.visible !== false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function getEngineeringItemSlugs(): string[] {
  if (!fs.existsSync(itemsDir)) return [];
  return fs
    .readdirSync(itemsDir)
    .filter((f) => f.toLowerCase().endsWith(".md"));
}

export function getAllEngineeringItems(): EngineeringItemSummary[] {
  const files = getEngineeringItemSlugs();
  const items = files.map((fileName) => {
    const fullPath = path.join(itemsDir, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    return mapItem(fileName, data as Partial<EngineeringItemFrontmatter>);
  });
  return items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function getVisibleEngineeringItems(): EngineeringItemSummary[] {
  return getAllEngineeringItems().filter((item) => item.visible !== false);
}

export function getItemsForCategory(
  categorySlug: string,
): EngineeringItemSummary[] {
  return getVisibleEngineeringItems().filter(
    (item) => item.category === categorySlug,
  );
}

export function getFeaturedEngineeringItems(
  limit = 6,
): EngineeringItemSummary[] {
  return getVisibleEngineeringItems()
    .filter((item) => item.featured)
    .slice(0, limit);
}

export async function getEngineeringItemBySlug(
  slug: string,
): Promise<EngineeringItemDetail | null> {
  const fullPath = path.join(itemsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const summary = mapItem(
    `${slug}.md`,
    data as Partial<EngineeringItemFrontmatter>,
  );
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return {
    ...summary,
    content: content.trim(),
    html: processed.toString(),
  };
}

export function countItemsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of getVisibleEngineeringItems()) {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
  }
  return counts;
}
