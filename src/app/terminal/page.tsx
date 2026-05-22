import type { Metadata } from "next";
import { Terminal } from "@/components/Terminal";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Terminal — ISA",
};

export default function TerminalPage() {
  const posts = getAllPosts().map((p) => ({ title: p.title, slug: p.slug }));
  const projects = getAllProjects().map((p) => ({ title: p.title, slug: p.slug }));

  return <Terminal posts={posts} projects={projects} />;
}
