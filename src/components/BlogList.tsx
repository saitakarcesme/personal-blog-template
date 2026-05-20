import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/lib/posts";

export function BlogList({ posts, limitOnMobile }: { posts: PostListItem[]; limitOnMobile?: boolean }) {
  if (posts.length === 0) {
    return <p className="text-sm text-text-muted">No posts yet.</p>;
  }

  return (
    <>
      <ul className="min-w-0 flex flex-col gap-6">
        {posts.map((post, index) => (
          <li key={post.slug} className={`min-w-0 ${limitOnMobile && index > 0 ? "hidden sm:block" : ""}`}>
            <article className="relative min-w-0 group pb-6 border-b border-border last:border-0 last:pb-0">
              {post.coverImage && (
                <div className="relative mb-4 aspect-[2/1] w-full flex-shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    quality={72}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h3 className="min-w-0 flex-1 text-xl font-bold text-text-main font-serif tracking-tight">
                    <Link href={`/posts/${post.slug}`} className="break-words group-hover:underline before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h3>
                </div>
                <div className="shrink-0 text-xs tabular-nums text-text-subtle font-medium">
                  <div className="flex items-center gap-2">
                    <time>{post.date}</time>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                  {post.author && (
                    <div className="mt-0.5">{post.author}</div>
                  )}
                </div>
              </div>

              <p className={`mt-2 break-words text-sm leading-relaxed text-text-muted font-serif ${limitOnMobile ? "line-clamp-3 sm:line-clamp-none" : ""}`}>
                {post.excerpt}
              </p>

              <div className="mt-3">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-text-subtle group-hover:text-text-main transition-colors mt-1"
                >
                  {post.hasMore ? "Read more" : "Open"}
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {limitOnMobile && posts.length > 1 && (
        <div className="mt-4 sm:hidden">
          <Link
            href="/blog"
            className="text-sm underline underline-offset-4 hover:opacity-80 text-text-main"
          >
            View all posts
          </Link>
        </div>
      )}
    </>
  );
}
