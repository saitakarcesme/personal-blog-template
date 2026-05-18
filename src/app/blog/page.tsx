import { BlogList } from "@/components/BlogList";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageShell wallpaper="blog">
      <PageHeader
        eyebrow="Blog"
        title="All posts"
        description="Longer notes, personal essays, and project-adjacent thoughts."
      />
      <BlogList posts={posts} />
    </PageShell>
  );
}
