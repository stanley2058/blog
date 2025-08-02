import { BlogActions } from "@/components/BlogActions";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { TypingCommandInline } from "@/components/TypingCommandInline";
import { WhoAmICard } from "@/components/WhoAmICard";

export default function Home() {
  return (
    <Main>
      <Navbar />

      <div className="flex flex-col gap-3">
        <WhoAmICard />

        <TypingCommandInline command="blog actions" frameInterval={35}>
          <BlogActions />
        </TypingCommandInline>
      </div>
    </Main>
  );
}
