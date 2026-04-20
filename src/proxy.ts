import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function wantsMarkdown(request: NextRequest) {
  return request.headers.get("accept")?.includes("text/markdown") ?? false;
}

function appendVaryAccept(response: NextResponse) {
  response.headers.append("Vary", "Accept");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" && wantsMarkdown(request)) {
    return appendVaryAccept(
      NextResponse.redirect(new URL("/llms.txt", request.url), 307),
    );
  }

  if (pathname.startsWith("/articles/") && wantsMarkdown(request)) {
    const slug = pathname.slice("/articles/".length);
    if (slug && !slug.includes("/")) {
      return appendVaryAccept(
        NextResponse.redirect(
          new URL(`/articles/raw/${slug}`, request.url),
          307,
        ),
      );
    }
  }

  if (pathname === "/" || pathname.startsWith("/articles/")) {
    return appendVaryAccept(NextResponse.next());
  }
}

export const config = {
  matcher: ["/", "/articles/:slug"],
};
