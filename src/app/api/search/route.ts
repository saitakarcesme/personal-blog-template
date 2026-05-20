import { NextResponse } from "next/server";
import { getAllPostsForSearch } from "@/lib/posts";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ posts: getAllPostsForSearch() });
}
