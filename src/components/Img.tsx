import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Img({
  width,
  height,
  ...rest
}: Omit<ComponentProps<typeof Image>, "width" | "height"> & {
  width?: string | number;
  height?: string | number;
}) {
  return (
    <Image
      width={400}
      height={300}
      className="rounded-md border border-border border-solid"
      sizes="100vw"
      style={{ width: width ?? "100%", height: height ?? "auto" }}
      {...rest}
    />
  );
}

export function ImgContainer({
  cols = 1,
  caption,
  className,
  children,
}: {
  cols?: number;
  caption?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("my-1 grid gap-1 [&>p]:my-0", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {caption && (
        <span style={{ gridColumn: `span ${cols} / span ${cols}` }}>
          {caption}
        </span>
      )}
      {children}
    </div>
  );
}
