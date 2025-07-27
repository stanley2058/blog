import { BundledLanguage, codeToHtml } from "shiki";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "group/code-block relative",
        "[&_code]:[counter-reset:step] [&_code]:[counter-increment:step_0]",
        "[&_code_.line::before]:[content:counter(step)] [&_code_.line::before]:[counter-increment:step]",
        "[&_code_.line::before]:w-4 [&_code_.line::before]:mr-6 [&_code_.line::before]:inline-block",
        "[&_code_.line::before]:text-right [&_code_.line::before]:text-muted-foreground/60",
      )}
    >
      <Text
        variant="xs"
        className={cn(
          "absolute top-2 right-2 font-bold text-muted-foreground/70",
          "opacity-100 group-hover/code-block:opacity-0",
          "transition-opacity duration-150 ease-in-out",
        )}
      >
        {lang}
      </Text>
      <div
        className="rounded-md p-2 border border-border border-solid"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
