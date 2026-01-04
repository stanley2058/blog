import { cn } from "@/lib/utils";

export function Main({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      className={cn(
        "mx-5 space-y-4 px-5 py-8 pb-4 font-mono",
        "md:mx-auto md:w-full md:max-w-202 md:px-10",
        className,
      )}
    >
      {children}
    </main>
  );
}
