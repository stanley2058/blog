import { type BundledLanguage, codeToHtml } from "shiki";
import { cn } from "@/lib/utils";
import { CodeBlockCopyButton } from "./CodeBlockCopyButton";
import { Text } from "./Text";

export async function CodeBlock({
  children,
  lang,
  noAutoTrim,
}: {
  children: string;
  lang: BundledLanguage;
  noAutoTrim?: boolean;
}) {
  "use cache";
  if (!noAutoTrim) children = children.trim();

  const html = await codeToHtml(children, {
    lang,
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
        "[&_code]:font-mono [&_code]:text-base",
        "[&_code]:[counter-increment:step_0] [&_code]:[counter-reset:step]",
        "[&_code_.line::before]:[content:counter(step)] [&_code_.line::before]:[counter-increment:step]",
        "[&_code_.line::before]:mr-6 [&_code_.line::before]:inline-block [&_code_.line::before]:w-4",
        "[&_code_.line::before]:text-right [&_code_.line::before]:text-muted-foreground/60",
      )}
    >
      <Text
        variant="xs"
        className={cn(
          "absolute top-2 right-2 font-bold text-muted-foreground/70",
          "opacity-70 group-hover/code-block:opacity-0",
          "transition-opacity duration-150 ease-in-out",
        )}
      >
        {lang}
      </Text>

      <CodeBlockCopyButton code={children} />

      <div
        className="overflow-auto rounded-xl border border-border border-solid bg-ctp-bg p-2"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: necessary for code highlighting
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
