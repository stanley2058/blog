import { cn } from "@/lib/utils";

export function TerminalWindow({
  title = "~",
  className,
  containerClassName,
  children,
}: {
  title?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg",
        "border border-border border-solid shadow-sm",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "relative flex flex-row items-center justify-center bg-muted",
          "border-0 border-border border-b border-solid",
        )}
      >
        <div className="absolute top-0 left-1 flex translate-y-1/2 flex-row gap-1">
          <span className="inline-flex size-3 shrink-0 rounded-full bg-ctp-red" />
          <span className="inline-flex size-3 shrink-0 rounded-full bg-ctp-yellow" />
          <span className="inline-flex size-3 shrink-0 rounded-full bg-ctp-green" />
        </div>
        {title}
      </div>
      <div className={cn("grow bg-ctp-bg text-ctp-fg", className)}>
        {children}
      </div>
    </div>
  );
}
