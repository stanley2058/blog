import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const textVariants = {
  h1: cn("text-4xl font-extrabold"),
  h2: cn("text-3xl font-bold"),
  h3: cn("text-2xl font-bold"),
  h4: cn("text-xl font-bold"),
  h5: cn("text-lg font-bold"),
  h6: cn("text-base font-bold"),
  p: cn("text-base"),
  lg: cn("text-lg"),
  sm: cn("text-sm"),
  xs: cn("text-xs"),
  body: cn("text-base"),
};
const htmlType = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
export type TextVariants = keyof typeof textVariants;

interface TextHTMLProps
  extends ComponentProps<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> {
  variant: (typeof htmlType)[number];
}
interface TextBaseProps extends ComponentProps<"span"> {
  variant?: Exclude<TextVariants, (typeof htmlType)[number]>;
}

export type TextProps = TextBaseProps | TextHTMLProps;
export function Text({
  variant = "body",
  className,
  children,
  ...rest
}: TextProps) {
  if (htmlType.includes(variant as (typeof htmlType)[number])) {
    const v = variant as (typeof htmlType)[number];
    const Comp = v;
    return (
      <Comp
        className={cn(textVariants[v], className)}
        {...(rest as TextHTMLProps)}
      >
        {children}
      </Comp>
    );
  }

  if (variant === "p") {
    return (
      <p
        className={cn(textVariants[variant], className)}
        {...(rest as ComponentProps<"p">)}
      >
        {children}
      </p>
    );
  }

  const v = variant as Exclude<TextVariants, (typeof htmlType)[number]>;
  return (
    <span
      className={cn(textVariants[v], className)}
      {...(rest as TextBaseProps)}
    >
      {children}
    </span>
  );
}
