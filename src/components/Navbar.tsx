"use client";

import {
  LucideMonitor,
  LucideMoon,
  LucidePaintBucket,
  LucideSun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Circle } from "./Circle";
import { Button } from "./ui/button";

export function Navbar({ className }: { className?: string }) {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <nav
      className={cn(
        "z-10 flex flex-row gap-6 bg-background/75 py-1 pr-2 pl-5",
        "rounded-xl border border-border border-solid backdrop-blur-lg",
        className,
      )}
    >
      <NavLink href="/">Home</NavLink>
      <NavLink href="/articles">Blog</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/design-system">Design</NavLink>

      <span className="grow" aria-hidden />

      <span className="flex flex-row items-center justify-center gap-0.5">
        {showThemeSwitcher && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("system")}
              disabled={!theme || theme === "system"}
            >
              <LucideMonitor />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("light")}
              disabled={theme === "light"}
            >
              <LucideSun />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("dark")}
              disabled={theme === "dark"}
            >
              <LucideMoon />
            </Button>
            <span>|</span>
          </>
        )}

        <Button
          variant={showThemeSwitcher ? "outline" : "ghost"}
          size="icon"
          onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
        >
          <LucidePaintBucket />
        </Button>
      </span>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className="flex flex-row items-center justify-center gap-1.5"
    >
      <Circle active={active} />
      {children}
    </Link>
  );
}
