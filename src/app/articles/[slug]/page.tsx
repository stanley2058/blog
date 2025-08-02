export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article>
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  return [{ slug: "zero-angular" }];
}

export const dynamicParams = false;
