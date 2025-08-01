export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article className="px-5 mx-5 md:max-w-[808px] md:mx-auto md:px-10">
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  return [{ slug: "zero-angular" }];
}

export const dynamicParams = false;
