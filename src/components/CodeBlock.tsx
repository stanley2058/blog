import { BundledLanguage, codeToHtml } from "shiki";

export async function CodeBlock({
  children,
  lang,
}: {
  children: string;
  lang: BundledLanguage;
}) {
  const html = await codeToHtml(children, {
    lang: lang,
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
    defaultColor: "light-dark()",
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
