import { CodeBlock } from "@/components/CodeBlock";
import { CommandInline } from "@/components/CommandInline";
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
      <div className="flex flex-row gap-2 items-baseline">
        <Text variant="lg">Large text</Text>
        <Text variant="body">Body text</Text>
        <Text variant="sm">Small text</Text>
      </div>

      <Text variant="p">
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </Text>

      <div className="flex flex-row gap-2">
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
      </div>

      <CommandInline>ls -al</CommandInline>

      <div className="grid grid-rows-2 grid-cols-7 gap-2">
        <span className="flex size-4 bg-ctp-rosewater" />
        <span className="flex size-4 bg-ctp-flamingo" />
        <span className="flex size-4 bg-ctp-pink" />
        <span className="flex size-4 bg-ctp-mauve" />
        <span className="flex size-4 bg-ctp-red" />
        <span className="flex size-4 bg-ctp-maroon" />
        <span className="flex size-4 bg-ctp-peach" />
        <span className="flex size-4 bg-ctp-yellow" />
        <span className="flex size-4 bg-ctp-green" />
        <span className="flex size-4 bg-ctp-teal" />
        <span className="flex size-4 bg-ctp-sky" />
        <span className="flex size-4 bg-ctp-sapphire" />
        <span className="flex size-4 bg-ctp-blue" />
        <span className="flex size-4 bg-ctp-lavender" />
      </div>

      <CodeBlock lang="tsx">
        {[
          '<Text variant="h1"># H1 title</Text>',
          '<Text variant="h2">## H2 title</Text>',
          '<Text variant="h3">### H3 title</Text>',
          '<Text variant="h4">#### H4 title</Text>',
          '<Text variant="h5">##### H5 title</Text>',
          '<Text variant="h6">###### H6 title</Text>',
          '<Text variant="lg">Large text</Text>',
          '<Text variant="sm">Small text</Text>',
          '<Text variant="body">Body text</Text>',
          '<Text variant="body" className="text-primary-foreground bg-destructive">',
          "  Destructive",
          "</Text>",
        ].join("\n")}
      </CodeBlock>
    </div>
  );
}
