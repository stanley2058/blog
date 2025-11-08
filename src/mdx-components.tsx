import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Text } from "./components/Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { cn } from "./lib/utils";

function toTitleId(children: ReactNode) {
  return encodeURIComponent(
    children?.toString()?.replace(/\s+/g, "-")?.toLowerCase() || "",
  );
}

const components: MDXComponents = {
  h1: ({ children, ...props }: ComponentProps<"h1">) => (
    <Text
      id={toTitleId(children)}
      variant="h1"
      className="relative mt-16 mb-8 border-border border-b-3 border-solid pb-2"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "-translate-x-[calc(100%+8px)] absolute left-0 hocus:text-ctp-blue text-ctp-blue/80",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        #
      </a>
      {children}
    </Text>
  ),
  h2: ({ children, ...props }: ComponentProps<"h2">) => (
    <Text
      id={toTitleId(children)}
      variant="h2"
      className="relative mt-12 mb-8 border-border border-b-2 border-solid pb-1"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "-translate-x-[calc(100%+6px)] absolute left-0 hocus:text-ctp-blue text-ctp-blue/80",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        #
      </a>
      {children}
    </Text>
  ),
  h3: ({ children, ...props }: ComponentProps<"h3">) => (
    <Text
      id={toTitleId(children)}
      variant="h3"
      className="relative mt-10 mb-8 border-border border-b border-solid pb-0.5"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "-translate-x-[calc(100%+4px)] absolute left-0 hocus:text-ctp-blue text-ctp-blue/80",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        #
      </a>
      {children}
    </Text>
  ),
  h4: (props) => <Text variant="h4" className="my-8" {...props} />,
  h5: (props) => <Text variant="h5" className="my-6" {...props} />,
  h6: (props) => <Text variant="h6" className="my-6" {...props} />,
  p: (props) => <Text variant="p" className="my-6" {...props} />,
  hr: (props) => <hr className="my-4 border-border border-solid" {...props} />,
  a: (props: ComponentProps<"a">) => {
    if (props.href?.startsWith("/")) {
      return (
        <Link
          href={props.href}
          className="hocus:text-ctp-lavender text-ctp-blue hocus:underline"
          {...props}
        />
      );
    }

    if (props.href?.startsWith("#")) {
      return (
        <a
          href={props.href}
          className="hocus:text-ctp-lavender text-ctp-blue hocus:underline"
          {...props}
        />
      );
    }

    return (
      <a
        className="hocus:text-ctp-lavender text-ctp-blue hocus:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  ul: (props) => <ul className="ml-4 list-disc" {...props} />,
  ol: (props) => <ol className="ml-7.5 list-decimal" {...props} />,
  li: (props) => <li className="my-2" {...props} />,
  table: (props) => <Table {...props} />,
  thead: (props) => <TableHeader {...props} />,
  tbody: (props) => <TableBody {...props} />,
  tr: (props) => <TableRow {...props} />,
  th: (props) => <TableHead {...props} />,
  td: (props) => <TableCell {...props} />,
  code: (props) => (
    <code
      className="rounded-sm border border-bolder border-solid px-1.5 py-0.5 text-ctp-green"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
