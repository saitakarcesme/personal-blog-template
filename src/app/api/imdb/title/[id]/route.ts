import { NextResponse } from "next/server";
import { getImdbTitleById } from "@/lib/imdbApi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "IMDb ID is required." }, { status: 400 });
  }

  try {
    const result = await getImdbTitleById(id);

    if (!result) {
      return NextResponse.json({ error: "Title not found." }, { status: 404 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "IMDb lookup failed.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
