import { LucideChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CommandInline({
  containerClassName,
  className,
  children,
}: {
  containerClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  let content = children;
  if (typeof children === "string") {
    const segments = children.split(" ");
    const binaryName = segments[0];
    content = (
      <>
        <span className={cn("text-ctp-green", className)}>{binaryName}</span>{" "}
        {segments.slice(1).join(" ")}
      </>
    );
  }

  return (
    <div className={cn("flex flex-row items-center", containerClassName)}>
      <LucideChevronRight className="text-ctp-yellow" />
      <span className={className}>{content}</span>
    </div>
  );
}
