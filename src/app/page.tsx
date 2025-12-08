import type { Metadata } from "next";
import { BlogActions } from "@/components/BlogActions";
import { FakeUptime } from "@/components/FakeUptime";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/SimpleFooter";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Text } from "@/components/Text";
import { TypingCommandInline } from "@/components/TypingCommandInline";
import { WhoAmICard } from "@/components/WhoAmICard";

export const metadata: Metadata = {
  title: "Stanley Wang - Blog",
  description: "My personal blog, tech, travel, and random thoughts.",
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Main>
        <Navbar className="sticky top-2.5" />

        <div className="my-12 flex flex-col gap-4 text-center">
          <Text variant="h1">Oh hi!</Text>
          <Text>
            I am Stanley, welcome to my blog.
            <br />I build software and sometimes writes down my journey doing
            so.
          </Text>
        </div>

        <TerminalWindow containerClassName="min-h-100" className="p-2">
          <div className="flex flex-col gap-3">
            <WhoAmICard />

            <FakeUptime />

            <TypingCommandInline command="blog actions" frameInterval={35}>
              <BlogActions />
            </TypingCommandInline>
          </div>
        </TerminalWindow>
      </Main>

      <SimpleFooter />
    </div>
  );
}
