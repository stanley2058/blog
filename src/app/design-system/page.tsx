import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { CommandInline } from "@/components/CommandInline";
import { DramFooter } from "@/components/DramFooter";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { Terminal } from "@/components/Terminal";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Text } from "@/components/Text";
import { TextLoading } from "@/components/TextLoading";
import { TypingCommandInline } from "@/components/TypingCommandInline";

export const metadata: Metadata = {
  title: "Design system - Stanley's Blog",
  description: "The design system of my personal blog.",
};

export default function DesignSystem() {
  return (
    <Main>
      <Navbar className="sticky top-2.5" />

      <Text variant="h1"># H1 title</Text>
      <Text variant="h2">## H2 title</Text>
      <Text variant="h3">### H3 title</Text>
      <Text variant="h4">#### H4 title</Text>
      <Text variant="h5">##### H5 title</Text>
      <Text variant="h6">###### H6 title</Text>
      <div className="flex flex-row items-baseline gap-2">
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
        <Text variant="body" className="bg-primary text-primary-foreground">
          Primary
        </Text>
        <Text variant="body" className="bg-secondary text-secondary-foreground">
          Secondary
        </Text>
        <Text variant="body" className="bg-muted text-muted-foreground">
          Muted
        </Text>
        <Text variant="body" className="bg-accent text-accent-foreground">
          Accent
        </Text>
        <Text variant="body" className="bg-destructive text-primary-foreground">
          Destructive
        </Text>
      </div>

      <CommandInline>ls -al</CommandInline>

      <div className="grid grid-cols-7 grid-rows-2 gap-2">
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

      <span className="flex flex-row gap-1">
        <TextLoading />
        <TextLoading rotation="counterclockwise" />
        <TextLoading variant="dot" interval={750} />
        <TextLoading variant="dot" interval={750} rotation="counterclockwise" />
        <TextLoading variant="dot-inverse" interval={1000} />
        <TextLoading
          variant="dot-inverse"
          interval={1000}
          rotation="counterclockwise"
        />
      </span>

      <TerminalWindow title="~">A terminal window</TerminalWindow>

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

      <Uptime />

      <Terminal />

      <div className="relative">
        <DramFooter />
      </div>
    </Main>
  );
}

async function Uptime() {
  "use cache";
  return (
    <TypingCommandInline command="uptime -s">
      {(() => {
        const isoDate = new Date().toISOString();
        const date = isoDate.split("T")[0];
        const time = isoDate.split("T")[1].split(".")[0];
        return `${date} ${time}`;
      })()}
    </TypingCommandInline>
  );
}
