import { CommandInline } from "@/components/CommandInline";
import { WhoAmICard } from "@/components/WhoAmICard";

export default function Home() {
  return (
    <div className="max-w-[768px] mx-auto px-5 font-mono space-y-4 py-4">
      <nav className="border border-border border-solid rounded-md py-2 px-4 bg-secondary flex flex-row gap-3">
        <span className="flex flex-row justify-center items-center gap-1.5">
          <Circle />
          Home
        </span>
      </nav>

      <main className="flex flex-col gap-3">
        <WhoAmICard />

        <CommandInline>blog list</CommandInline>
      </main>
    </div>
  );
}

function Circle() {
  return (
    <span className="rounded-full bg-ctp-yellow flex size-2" aria-hidden />
  );
}
