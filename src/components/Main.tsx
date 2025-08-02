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
        "font-mono px-5 py-8 pb-4 mx-5 space-y-4",
        "md:max-w-[808px] md:mx-auto md:px-10 ",
        className,
      )}
    >
      {children}
    </main>
  );
}
