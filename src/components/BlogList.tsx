"use client";

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
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h3 className="min-w-0 flex-1 text-xl font-bold text-text-main font-serif tracking-tight">
                    <Link href={`/posts/${post.slug}`} className="break-words group-hover:underline before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h3>
                </div>
                <div className="shrink-0 text-xs tabular-nums text-text-subtle font-medium">
                  <time>{post.date}</time>
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
            href="/posts"
            className="text-sm underline underline-offset-4 hover:opacity-80 text-text-main"
          >
            View all posts
          </Link>
        </div>
      )}
    </>
  );
}
