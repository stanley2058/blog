import { NextResponse } from "next/server";
import { getAllPostWithMeta } from "@/lib/meta";

export async function GET() {
  const posts = await getAllPostWithMeta();

  const body = [
    "# Stanley's Blog",
    "",
    "Hi. I am Stanley, welcome to my blog.",
    "I build software and sometimes writes down my journey doing so.",
    "",
    "## Navigation",
    "",
    "- [Home](/)",
    "- [Articles](/articles)",
    "- [About](/about)",
    "- [Design system](/design-system)",
    "",
    "## Articles",
    "",
    ...posts.map((post) => `- [${post.title}](/articles/raw/${post.slug})`),
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
