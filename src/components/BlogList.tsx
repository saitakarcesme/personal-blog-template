"use client";

import Link from "next/link";
import type { PostListItem } from "@/lib/posts";
import { useThemeClasses } from "./useThemeClasses";

export function BlogList({ posts, limitOnMobile }: { posts: PostListItem[]; limitOnMobile?: boolean }) {
  const tc = useThemeClasses();

  if (posts.length === 0) {
    return <p className={`text-sm ${tc.textMuted}`}>No posts yet.</p>;
  }

  return (
    <>
      <ul className="min-w-0 space-y-5">
        {posts.map((post, index) => (
          <li key={post.slug} className={`min-w-0 ${limitOnMobile && index > 0 ? "hidden sm:block" : ""}`}>
            <article className={`min-w-0 sm:px-5 sm:py-5 ${tc.listItem}`}>
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h3 className={`min-w-0 flex-1 text-base font-semibold ${tc.text}`}>
                  <Link href={`/posts/${post.slug}`} className="break-words hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className={`shrink-0 text-xs text-right tabular-nums ${tc.textSubtle}`}>
                  <time>{post.date}</time>
                  {post.author && (
                    <div className="mt-0.5">{post.author}</div>
                  )}
                </div>
              </div>

              <p className={`mt-3 break-words text-sm leading-7 ${limitOnMobile ? "line-clamp-4 sm:line-clamp-none" : ""} ${tc.textMuted}`}>
                {post.excerpt}
              </p>

              <div className="mt-3">
                <Link
                  href={`/posts/${post.slug}`}
                  className={`text-xs font-medium underline-offset-4 hover:underline ${tc.textMuted}`}
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
            className={`text-sm underline underline-offset-4 hover:opacity-80 ${tc.text}`}
          >
            View all posts
          </Link>
        </div>
      )}
    </>
  );
}
