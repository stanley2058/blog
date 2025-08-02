"use client";

import {
  LucideMonitor,
  LucideMoon,
  LucidePaintBucket,
  LucideSun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Circle } from "./Circle";

export function Navbar() {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { theme, setTheme } = useTheme();
  return (
    <nav className="border border-border border-solid rounded-md py-2 px-4 bg-background flex flex-row gap-6">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/articles">Blog</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/design-system">Design</NavLink>

      <span className="grow" aria-hidden />

      <span className="flex flex-row gap-0.5 justify-center items-center">
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
      className="flex flex-row justify-center items-center gap-1.5"
    >
      <Circle active={active} />
      {children}
    </Link>
  );
}
