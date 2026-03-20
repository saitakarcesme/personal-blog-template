import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only allow access to admin routes in development mode
  if (process.env.NODE_ENV === "production" && request.nextUrl.pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 });
  }
}

export const config = {
  matcher: "/admin/:path*",
};
