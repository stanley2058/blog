import type { Metadata } from "next";
import { BlogActions } from "@/components/BlogActions";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { TerminalWindow } from "@/components/TerminalWindow";
import { TypingCommandInline } from "@/components/TypingCommandInline";
import { WhoAmICard } from "@/components/WhoAmICard";

export const metadata: Metadata = {
  title: "Stanley Wang - Blog",
  description: "My personal blog, tech, travel, and random thoughts.",
};

export default function Home() {
  return (
    <Main>
      <Navbar className="sticky top-2.5" />

      <TerminalWindow containerClassName="h-100" className="p-2">
        <div className="flex flex-col gap-3">
          <WhoAmICard />

          <TypingCommandInline command="blog actions" frameInterval={35}>
            <BlogActions />
          </TypingCommandInline>
        </div>
      </TerminalWindow>
    </Main>
  );
}
