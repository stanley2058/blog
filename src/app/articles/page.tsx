import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/Img";
import { Text } from "@/components/Text";
import { getAllPostWithMeta, type Meta } from "@/lib/meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Articles - Stanley's Blog",
  description: "All the articles I wrote.",
};

export default async function Articles() {
  const metadata = await getAllPostWithMeta();

  return (
    <div className="flex flex-col gap-4">
      {metadata.map((meta) => (
        <Post key={meta.slug} meta={meta} />
      ))}
    </div>
  );
}

function Post({ meta }: { meta: Meta & { slug: string } }) {
  return (
    <Link
      href={`/articles/${meta.slug}`}
      className={cn(
        "bg-background shadow-sm",
        "rounded-lg border border-border border-solid p-4",
        "hocus:bg-accent hocus:text-accent-foreground",
      )}
    >
      <div className="block space-y-2">
        {meta.image && (
          <Img
            src={meta.image}
            alt={meta.title}
            className={cn(
              "mb-3 w-full rounded-md object-cover",
              "md:float-right md:mb-2 md:ml-4 md:w-48",
            )}
            width="auto"
            height="200px"
          />
        )}

        <Text variant="h3" className="m-0">
          {meta.title}
        </Text>

        <Text variant="sm" className="font-medium text-muted-foreground italic">
          {new Date(meta.timestamp).toLocaleString()}
        </Text>

        {meta.tags.length > 0 && (
          <Text
            variant="sm"
            className="flex flex-row flex-wrap gap-1 font-medium"
          >
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-1.5 text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </Text>
        )}

        <Text variant="body" className="mt-3 whitespace-pre-wrap">
          {meta.description}
        </Text>

        <div className="clear-both" />
      </div>
    </Link>
  );
}
