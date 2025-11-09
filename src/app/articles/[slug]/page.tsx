import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { TableOfContent } from "@/components/TableOfContent";
import { getAllPostWithMeta } from "@/lib/meta";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getAllPostWithMeta();
  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    return {
      title: "Stanley Wang - Blog",
      description: "My personal blog, tech, travel, and random thoughts.",
    };
  }

  const title = `${post.title} - Stanley's Blog`;
  const meta: Metadata = {
    title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title,
      description: post.description,
      tags: post.tags,
    },
    twitter: {
      title,
      description: post.description,
    },
  };

  if (post.image) {
    meta.openGraph = {
      ...meta.openGraph,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    };
    meta.twitter = {
      ...meta.twitter,
      card: "summary_large_image",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    };
  }
  return meta;
}
