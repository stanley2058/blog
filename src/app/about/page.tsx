import { LucideSquareArrowOutUpRight } from "lucide-react";
import type { Metadata } from "next";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { Spoiler } from "@/components/Spoiler";
import { Text } from "@/components/Text";
import { WhoAmICard } from "@/components/WhoAmICard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About me - Stanley's Blog",
  description: "Most things about me.",
};

export default function About() {
  return (
    <Main>
      <Navbar className="sticky top-2.5" />

      <div className="flex flex-col gap-3 rounded-lg border border-border border-solid p-4">
        <Text variant="h2">About me</Text>

        <Text variant="body" className="text-accent-foreground italic">
          Hi there, welcome to my personal blog. I am Stanley, a guy interested
          in tech, building stuff, traveling, and sometimes writing.
        </Text>

        <WhoAmICard headless full />

        <div className="flex flex-col gap-2">
          <Text variant="h3">Stack</Text>
          <Text variant="body" className="text-accent-foreground italic">
            Things I use everyday, in no particular order.
          </Text>
          <div className="flex flex-col gap-1 rounded-md border border-border border-solid px-4 py-2">
            <TextRow>- Language: TypeScript, JavaScript</TextRow>
            <TextRow>- Frontend: React, Tailwind, shadcn/ui</TextRow>
            <TextRow>- Backend: Express, Fastify</TextRow>
            <TextRow>- Framework: Next.js</TextRow>
            <TextRow>- Database: PostgreSQL, SQLite, Redis</TextRow>
            <TextRow>- Runtime: Node.js, Bun</TextRow>
            <TextRow>- AI: Supermaven, t3.chat</TextRow>
            <TextRow>- Libs: zod, AI-SDK, zustand</TextRow>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="h3">Experience</Text>
          <div className="flex flex-col gap-1 rounded-md border border-border border-solid px-4 py-2">
            <Text variant="lg" className="font-semibold text-ctp-yellow">
              HackMD
            </Text>
            <TextRow>- Title: Full-stack developer</TextRow>
            <TextRow>- Time: 2023/4 - Now</TextRow>
            <TextRow>- Works:</TextRow>
            <TextRow className="pl-[2ch]">
              - Folder system (distributed CRDT-based sync engine)
            </TextRow>
            <TextRow className="pl-[2ch]">- Neo UI overhaul</TextRow>
            <TextRow className="pl-[2ch]">- New commenting experience</TextRow>
            <TextRow className="pl-[2ch]">
              - Legacy tooling and dependency migrations
            </TextRow>
          </div>

          <Spoiler title="Student works">
            <div className="flex flex-col gap-1 rounded-md border border-border border-solid px-4 py-2">
              <Text variant="lg" className="font-semibold text-ctp-yellow">
                National Taiwan Ocean University
              </Text>
              <TextRow>- Title: Grad student</TextRow>
              <TextRow>- Time: 2020/9 - 2022/8</TextRow>
              <TextRow>
                - Department: Department of Computer Science and Engineering
              </TextRow>
              <TextRow>
                - Lab: Service-Oriented Software Engineering Lab
              </TextRow>
              <TextRow>- Works:</TextRow>
              <TextRow className="pl-[2ch]">
                - KMamiz
                <br />
                <Text variant="sm" className="inline-flex pl-[2ch]">
                  The main project related to my thesis, a tool analyzes and
                  monitors microservices deployed in a Kubernetes cluster in a
                  non-intrusive way.
                </Text>
                <br />
                <Text variant="sm" className="pl-[2ch]">
                  <a
                    href="https://github.com/stanley2058/KMamiz"
                    className="inline-flex items-center gap-1 text-ctp-lavender hocus:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LucideSquareArrowOutUpRight className="inline-flex size-3" />
                    github.com/stanley2058/KMamiz
                  </a>
                </Text>
                <br />
                <Text variant="sm" className="pl-[2ch]">
                  <a
                    href="https://conf.researchr.org/details/apsec-2022/apsec-2022-era-early-research-achievements/9/Analyzing-and-Monitoring-Kubernetes-Microservices-based-on-Distributed-Tracing-and-Se"
                    className="inline-flex items-center gap-1 text-ctp-lavender hocus:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LucideSquareArrowOutUpRight className="inline-flex size-3" />
                    Published in APSEC 2022 (ERA)
                  </a>
                </Text>
              </TextRow>
              <TextRow className="pl-[2ch]">
                - PDAS
                <br />
                <Text variant="sm" className="inline-flex pl-[2ch]">
                  A project collaborating with the Industrial Technology
                  Research Institute (ITRI). Uses government-issued certificates
                  combined with blockchain to create a tamper-proof digital
                  contract with legality.
                </Text>
                <Text variant="sm" className="pl-[2ch]">
                  <a
                    href="https://ieeexplore.ieee.org/document/9359082"
                    className="inline-flex items-center gap-1 text-ctp-lavender hocus:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LucideSquareArrowOutUpRight className="inline-flex size-3" />
                    IEEE Xplore
                  </a>
                </Text>
              </TextRow>
            </div>
          </Spoiler>
        </div>
      </div>
    </Main>
  );
}

function TextRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Text variant="body" className={cn("leading-tight", className)}>
      {children}
    </Text>
  );
}
