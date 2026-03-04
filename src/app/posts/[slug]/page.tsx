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
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton />

        <header className="mt-8">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-2 text-sm tabular-nums text-white/55">
            {post.date}
            {post.author && (
              <>
                <span className="mx-2 font-black">·</span>
                {post.author}
              </>
            )}
          </div>
        </header>

        <article
          className="prose prose-invert mt-8 max-w-none prose-headings:scroll-mt-24 prose-a:text-white/90 prose-a:underline prose-a:underline-offset-4 prose-code:text-white/90 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>
    </div>
  );
}

