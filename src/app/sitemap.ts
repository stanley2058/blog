import type { MetadataRoute } from "next";
import { getAllPostWithMeta } from "@/lib/meta";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostWithMeta();

  const articles = posts.map(
    (post) =>
      ({
        url: `https://blog.stw.tw/articles/${post.slug}`,
        lastModified: new Date(post.timestamp),
        changeFrequency: "monthly",
        priority: 0.8,
      }) satisfies MetadataRoute.Sitemap[number],
  );

  return [
    {
      url: "https://blog.stw.tw",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://blog.stw.tw/articles",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...articles,
    {
      url: "https://blog.stw.tw/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://blog.stw.tw/design-system",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
