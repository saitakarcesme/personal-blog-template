"use client";

import Link from "next/link";
import type { PostListItem } from "@/lib/posts";
import { useThemeClasses } from "./useThemeClasses";

export function BlogList({ posts }: { posts: PostListItem[] }) {
  const tc = useThemeClasses();

  if (posts.length === 0) {
    return <p className={`text-sm ${tc.textMuted}`}>No posts yet.</p>;
  }

  return (
    <ul className="min-w-0 space-y-5">
      {posts.map((post) => (
        <li key={post.slug} className="min-w-0">
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

            <p className={`mt-3 break-words text-sm leading-7 ${tc.textMuted}`}>
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
  );
}
