import { getAllPostWithMeta } from "@/lib/meta";
import { BlogCommands } from "./BlogCommands";

export async function BlogCommandStateProvider() {
  const posts = await getAllPostWithMeta();

  return (
    <BlogCommands
      posts={posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        brief:
          p.description.length > 120
            ? `${p.description.slice(0, 120)}...`
            : p.description,
      }))}
    />
  );
}
