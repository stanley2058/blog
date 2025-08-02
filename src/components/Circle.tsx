import { cn } from "@/lib/utils";

export function Circle({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full flex size-2",
        "border border-solid border-ctp-yellow",
        { "bg-ctp-yellow": active },
      )}
      aria-hidden
    />
  );
}
