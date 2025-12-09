import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

export interface Meta {
  title: string;
  tags: string[];
  timestamp: number;
  description: string;
  image?: string;
}

export async function getAllPostWithMeta() {
  "use cache";
  const basePath = path.join(process.cwd(), "src/content-meta/");
  const files = await fs.readdir(basePath);

  const metadata = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(basePath, file);
      const content = await fs.readFile(filePath, "utf8");
      return {
        ...(parse(content) as Meta),
        slug: file.replace(".yaml", ""),
      };
    }),
  );
  return metadata.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getPostMdxSource(slug: string) {
  "use cache";
  const filePath = path.join(process.cwd(), "src/content/", `${slug}.mdx`);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch {
    return null;
  }
}
