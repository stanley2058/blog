import fs from "node:fs/promises";
import path from "node:path";
import { TableOfContent } from "@/components/TableOfContent";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article className="relative [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-18">
      <TableOfContent />
      <Post />
    </article>
  );
}

export async function generateStaticParams() {
  const files = await fs.readdir(path.join(process.cwd(), "src/content/"));

  return files.map((file) => ({ slug: file.replace(".mdx", "") }));
}
