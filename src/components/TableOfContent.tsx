"use client";

import { LucideMenu } from "lucide-react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Text } from "./Text";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function useParentContainer<T extends HTMLElement | null>(self: RefObject<T>) {
  const [parent, setParent] = useState(() => self.current?.parentElement);
  useEffect(() => setParent(self.current?.parentElement), [self.current]);
  return parent;
}

export function TableOfContent() {
  const selfRef = useRef<HTMLDivElement>(null);
  const parent = useParentContainer(selfRef);
  const [content, setContent] = useState<
    { id: string; display: string; link: string; type: "h1" | "h2" | "h3" }[]
  >([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!parent) return;
    const headings = parent.querySelectorAll<HTMLElement>(
      ":is(h1, h2, h3):has(a)",
    );

    const content = Array.from(headings).map((heading) => ({
      id: heading.id,
      display: heading.innerText.slice(2),
      link: heading.querySelector("a")?.href || "#",
      type: heading.tagName.toLowerCase() as "h1" | "h2" | "h3",
    }));
    setContent(content);

    const observer = new IntersectionObserver(
      () => {
        const headingPos = [...headings].map((h) => ({
          id: h.id,
          y: h.getBoundingClientRect().y - 72,
        }));
        const current = headingPos.findLast(({ y }) => y < 0);
        if (!current) setCurrent(headings[0].id);
        else setCurrent(current.id);
      },
      {
        root: null,
        rootMargin: "-72px 0px 80% 0px",
        threshold: [0, 1],
      },
    );
    headings.forEach((h) => {
      observer.observe(h);
    });

    return () => observer.disconnect();
  }, [parent]);

  return (
    <div
      ref={selfRef}
      className={cn(
        "-translate-x-1/2 fixed top-0 left-1/2 z-10 h-full w-full",
        "max-w-[calc(100%-40px)] px-5 md:max-w-[808px] md:px-10",
        "pointer-events-none",
      )}
    >
      <div className="pointer-events-auto absolute right-0 bottom-5 md:bottom-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="m-1 size-8 backdrop-blur-md"
            >
              <LucideMenu />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={4}
            align="end"
            className="flex w-fit max-w-[240px] flex-col"
          >
            {content.map(({ id, display, link, type }) => (
              <a key={id} href={link} className="flex">
                <Button
                  variant="ghost"
                  className={cn("max-w-full grow justify-start", {
                    "ml-0": type === "h1",
                    "ml-2": type === "h2",
                    "ml-4": type === "h3",
                  })}
                >
                  <Text
                    variant="sm"
                    className={cn("truncate text-muted-foreground", {
                      "text-accent-foreground": current === id,
                    })}
                  >
                    {display.repeat(2)}
                  </Text>
                </Button>
              </a>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
