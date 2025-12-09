import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPostMdxSource } from "@/lib/meta";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const source = await getPostMdxSource(slug);
  if (!source) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(source, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
