import Link from "next/link";
import { Img } from "@/components/Img";
import { Text } from "@/components/Text";
import { getAllPostWithMeta, type Meta } from "@/lib/meta";
import { cn } from "@/lib/utils";

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
        "grid grid-cols-[minmax(0,1fr)_auto] gap-2 bg-background shadow-sm",
        "rounded-lg border border-border border-solid p-4",
        "hocus:bg-accent hocus:text-accent-foreground",
      )}
    >
      <div className="flex flex-col gap-1">
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

        <Text variant="body" className="mt-3">
          {meta.description}
        </Text>
      </div>

      {meta.image && (
        <Img src={meta.image} alt={meta.title} width="auto" height="200px" />
      )}
    </Link>
  );
}
