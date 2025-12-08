"use client";

import { useMediaQuery } from "@react-hookz/web";
import {
  LucideMenu,
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
        "z-10 flex flex-row gap-2 bg-background/75 px-1 py-1 md:gap-6 md:pr-2 md:pl-5",
        "rounded-lg border border-border border-solid shadow-sm backdrop-blur-lg",
        className,
      )}
    >
      <MobileNavMenu />

      <NavLink hideOnMobile href="/">
        Home
      </NavLink>
      <NavLink hideOnMobile href="/articles">
        Blog
      </NavLink>
      <NavLink hideOnMobile href="/about">
        About
      </NavLink>
      <NavLink hideOnMobile href="/design-system">
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
  hideOnMobile,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  hideOnMobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-row items-center justify-center gap-1.5",
        { "hidden md:flex": hideOnMobile && !active },
        className,
      )}
    >
      <Circle active={active} />
      {children}
    </Link>
  );
}

function MobileNavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <LucideMenu />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={4}
        align="start"
        className="flex w-fit flex-row gap-2 p-1"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/articles">Blog</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/design-system">Design</NavLink>
      </PopoverContent>
    </Popover>
  );
}
