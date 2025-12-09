import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TableOfContent } from "@/components/TableOfContent";
import { Text } from "@/components/Text";
import { getAllPostWithMeta, getPostMeta } from "@/lib/meta";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const { default: Post } = await import(`@/content/${slug}.mdx`);

    return (
      <article className="relative [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-18">
        <PostMetadata slug={slug} />
        <TableOfContent />
        <Post />
      </article>
    );
  } catch {
    return notFound();
  }
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
    alternates: {
      canonical: `https://blog.stw.tw/articles/${slug}`,
      types: {
        "text/markdown": `https://blog.stw.tw/articles/raw/${slug}`,
      },
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

async function PostMetadata({ slug }: { slug: string }) {
  const meta = await getPostMeta(slug);

  const jsonLd = meta
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://blog.stw.tw/articles/${slug}`,
        },
        headline: meta.title,
        description: meta.description,
        datePublished: new Date(meta.timestamp).toISOString(),
        dateModified: new Date(
          meta.modifiedTimestamp ?? meta.timestamp,
        ).toISOString(),
        author: {
          "@type": "Person",
          name: "Stanley Wang",
        },
        publisher: {
          "@type": "Organization",
          name: "Stanley's Blog",
          logo: {
            "@type": "ImageObject",
            url: "https://blog.stw.tw/icon0.svg",
          },
        },
        ...(meta.image && {
          image: meta.image,
        }),
        ...(meta.tags.length > 0 && {
          keywords: meta.tags.join(", "),
        }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          key="jsonld"
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: necessary for jsonld
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e"),
          }}
        />
      )}

      {meta?.timestamp && (
        <Text
          variant="sm"
          className="absolute top-0 left-0 flex translate-y-[-120%] flex-row gap-2 text-muted-foreground/60"
        >
          <time dateTime={meta.timestamp.toString()}>
            {formatDate(meta.timestamp)}
          </time>

          {meta.modifiedTimestamp && (
            <time dateTime={meta.modifiedTimestamp.toString()}>
              | Updated at: {formatDate(meta.modifiedTimestamp)}
            </time>
          )}
        </Text>
      )}
    </>
  );
}

function formatDate(date: number) {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Taipei",
    timeZoneName: "short",
  }).format(date);
}
