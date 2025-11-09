"use client";

import { useMediaQuery } from "@react-hookz/web";
import {
  LucideMonitor,
  LucideMoon,
  LucidePaintBucket,
  LucideSun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Circle } from "./Circle";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Navbar({ className }: { className?: string }) {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { theme, setTheme } = useTheme();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const setThemeWithTransition = useCallback(
    (theme: string) => {
      const transition = document.startViewTransition?.(() => {
        setTheme(theme);
      });

      if (!transition) return setTheme(theme);
    },
    [setTheme],
  );

  return (
    <nav
      className={cn(
        "z-10 flex flex-row gap-4 bg-background/75 py-1 pr-2 pl-5 sm:gap-6",
        "rounded-lg border border-border border-solid shadow-sm backdrop-blur-lg",
        className,
      )}
    >
      <NavLink href="/">Home</NavLink>
      <NavLink href="/articles">Blog</NavLink>
      <NavLink className="hidden sm:flex" href="/about">
        About
      </NavLink>
      <NavLink className="hidden md:flex" href="/design-system">
        Design
      </NavLink>

      <span className="grow" aria-hidden />

      <span className="flex flex-row items-center justify-center gap-0.5">
        <Popover open={showThemeSwitcher} onOpenChange={setShowThemeSwitcher}>
          <PopoverTrigger asChild>
            <Button
              variant={showThemeSwitcher ? "outline" : "ghost"}
              size="icon"
              onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
              className="relative"
            >
              <LucidePaintBucket />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side={isSmallDevice ? "bottom" : "left"}
            sideOffset={isSmallDevice ? 8 : 4}
            align={isSmallDevice ? "end" : "center"}
            className="flex w-fit flex-row gap-2 p-1 md:p-0"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeWithTransition("system")}
              disabled={!theme || theme === "system"}
            >
              <LucideMonitor />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeWithTransition("light")}
              disabled={theme === "light"}
            >
              <LucideSun />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeWithTransition("dark")}
              disabled={theme === "dark"}
            >
              <LucideMoon />
            </Button>
          </PopoverContent>
        </Popover>
      </span>
    </nav>
  );
}

function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-row items-center justify-center gap-1.5",
        className,
      )}
    >
      <Circle active={active} />
      {children}
    </Link>
  );
}
