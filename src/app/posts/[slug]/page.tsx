import { BackButton } from "@/components/BackButton";
import { getPostDetail, getPostSlugs, getPostSlugFromFileName } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getPostSlugs().map((fileName) => ({
    slug: getPostSlugFromFileName(fileName),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) notFound();

  return (
    <div className="min-h-dvh text-foreground">
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-10 min-[1300px]:py-10 sm:px-6 lg:px-8">
        <BackButton />

        <header className="mt-12 mb-16 text-center">
          <h1 className="text-balance text-4xl md:text-5xl font-bold tracking-tight text-text-main font-serif leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 text-sm font-medium text-text-subtle uppercase tracking-widest flex items-center justify-center gap-3">
            <span>{post.date}</span>
            {post.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span>{post.author}</span>
              </>
            )}
          </div>
        </header>

        <article
          className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl font-serif text-lg leading-loose prose-p:text-text-main prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-main prose-a:text-text-main prose-a:underline-offset-4 hover:prose-a:opacity-80 prose-strong:text-text-main prose-blockquote:border-l-accent prose-blockquote:text-text-muted prose-blockquote:font-style-italic prose-code:text-accent prose-pre:bg-surface-hover prose-pre:border prose-pre:border-border prose-video:w-full prose-video:rounded-xl prose-video:aspect-video prose-iframe:w-full prose-iframe:rounded-xl prose-iframe:aspect-video prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>
    </div>
  );
}

