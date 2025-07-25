import { CodeBlock } from "@/components/CodeBlock";
import { Text } from "@/components/Text";

export default function DesignSystem() {
  return (
    <div className="mt-4 max-w-[720px] mx-auto px-4 flex flex-col gap-2 items-center justify-center font-mono">
      <Text variant="h1"># H1 title</Text>
      <Text variant="h2">## H2 title</Text>
      <Text variant="h3">### H3 title</Text>
      <Text variant="h4">#### H4 title</Text>
      <Text variant="h5">##### H5 title</Text>
      <Text variant="h6">###### H6 title</Text>
      <Text variant="lg">Large text</Text>
      <Text variant="sm">Small text</Text>
      <Text variant="body">Body text</Text>

      <Text variant="p">
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </Text>

      <Text variant="body" className="text-primary-foreground bg-primary">
        Primary
      </Text>
      <Text variant="body" className="text-secondary-foreground bg-secondary">
        Secondary
      </Text>
      <Text variant="body" className="text-muted-foreground bg-muted">
        Muted
      </Text>
      <Text variant="body" className="text-accent-foreground bg-accent">
        Accent
      </Text>
      <Text variant="body" className="text-primary-foreground bg-destructive">
        Destructive
      </Text>

      <CodeBlock lang="tsx">
        {[
          '<Text variant="body" className="text-primary-foreground bg-destructive">',
          "  Destructive",
          "</Text>",
        ].join("\n")}
      </CodeBlock>
    </div>
  );
}
