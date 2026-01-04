"use client";

import {
  LucideArrowRight,
  LucideDraftingCompass,
  LucideForm,
  LucideHouse,
  LucideIdCardLanyard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Text } from "./Text";
import { Kbd } from "./ui/kbd";

export function BlogCommands({
  posts,
}: {
  posts: { slug: string; title: string; brief: string }[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isOpenRef = useRef(false);
  isOpenRef.current = open;

  const navigate = useEffectEvent((path: string) => {
    router.push(path);
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const ctrlOrMeta = e.metaKey || e.ctrlKey;
      if (e.key === "k" && ctrlOrMeta) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (isOpenRef.current) {
        switch (true) {
          case e.key === "1" && ctrlOrMeta: {
            e.preventDefault();
            navigate("/");
            setOpen(false);
            break;
          }
          case e.key === "2" && ctrlOrMeta: {
            e.preventDefault();
            navigate("/articles");
            setOpen(false);
            break;
          }
          case e.key === "3" && ctrlOrMeta: {
            e.preventDefault();
            navigate("/about");
            setOpen(false);
            break;
          }
          case e.key === "4" && ctrlOrMeta: {
            e.preventDefault();
            navigate("/design-system");
            setOpen(false);
            break;
          }
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="h-120">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="h-full max-h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigations">
          <CommandItem
            onSelect={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            <LucideHouse />
            <span>Home</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/articles");
              setOpen(false);
            }}
          >
            <LucideForm />
            <span>Articles</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/about");
              setOpen(false);
            }}
          >
            <LucideIdCardLanyard />
            <span>About</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/design-system");
              setOpen(false);
            }}
          >
            <LucideDraftingCompass />
            <span>Design</span>
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {posts.length > 0 && (
          <>
            <CommandSeparator />

            <CommandGroup heading="Atricles">
              {posts.map((post) => (
                <CommandItem
                  key={post.slug}
                  onSelect={() => router.push(`/articles/${post.slug}`)}
                >
                  <LucideArrowRight />
                  <span className="flex flex-col gap-0.5">
                    <Text variant="sm">{post.title}</Text>
                    <Text variant="xs" className="text-muted-foreground">
                      {post.brief}
                    </Text>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>

      <div className="sticky bottom-0 border-border border-t border-solid bg-accent px-1.5 pt-0.75 pb-1 font-medium text-muted-foreground text-sm leading-sm">
        <Kbd>Enter</Kbd> Open
      </div>
    </CommandDialog>
  );
}
