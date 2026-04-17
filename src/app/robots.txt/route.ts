import { NextResponse } from "next/server";

const body = [
  "User-agent: *",
  "Allow: /",
  "Content-Signal: ai-train=no, search=yes, ai-input=yes",
  "",
  "Sitemap: https://blog.stw.tw/sitemap.xml",
].join("\n");

export function GET() {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
