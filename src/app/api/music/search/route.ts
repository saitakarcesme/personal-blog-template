import { NextResponse } from "next/server";
import { searchMusic } from "@/lib/musicApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMusic(query);
    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Music lookup failed.";

    return NextResponse.json(
      { error: message, results: [] },
      { status: 502 },
    );
  }
}
