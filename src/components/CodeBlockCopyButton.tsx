"use client";

import { LucideClipboard, LucideClipboardCheck } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function CodeBlockCopyButton({ code }: { code: string }) {
  const [copied, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute top-2 right-2 opacity-0 group-hover/code-block:opacity-100",
        "transition-opacity duration-150 ease-in-out",
        { "hocus:text-ctp-green text-ctp-green": copied },
      )}
      onClick={() => {
        startTransition(async () => {
          await navigator.clipboard.writeText(code);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        });
      }}
    >
      {copied ? <LucideClipboardCheck /> : <LucideClipboard />}
    </Button>
  );
}
