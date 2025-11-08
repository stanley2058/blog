import { cn } from "@/lib/utils";

export function Circle({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-2 rounded-full",
        "border border-ctp-yellow border-solid",
        { "bg-ctp-yellow": active },
      )}
      aria-hidden
    />
  );
}
