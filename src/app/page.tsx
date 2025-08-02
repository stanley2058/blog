import { CommandInline } from "@/components/CommandInline";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { WhoAmICard } from "@/components/WhoAmICard";

export default function Home() {
  return (
    <Main>
      <Navbar />

      <div className="flex flex-col gap-3">
        <WhoAmICard />

        <CommandInline>blog list</CommandInline>
      </div>
    </Main>
  );
}
