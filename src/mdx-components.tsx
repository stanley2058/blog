import type { MDXComponents } from "mdx/types";
import { Text } from "./components/Text";
import { ComponentProps, ReactNode } from "react";
import Link from "next/link";
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
      className="relative mt-16 mb-8 pb-2 border-b-3 border-solid border-border"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "absolute text-ctp-blue/80 left-0 -translate-x-[calc(100%+8px)] hocus:text-ctp-blue",
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
      className="relative mt-12 mb-8 pb-1 border-b-2 border-solid border-border"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "absolute text-ctp-blue/80 left-0 -translate-x-[calc(100%+6px)] hocus:text-ctp-blue",
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
      className="relative mt-10 mb-8 pb-0.5 border-b border-solid border-border"
      {...props}
    >
      <a
        href={`#${toTitleId(children)}`}
        className={cn(
          "absolute text-ctp-blue/80 left-0 -translate-x-[calc(100%+4px)] hocus:text-ctp-blue",
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
  hr: (props) => <hr className="border-border border-solid my-4" {...props} />,
  a: (props: ComponentProps<"a">) => {
    if (props.href?.startsWith("/")) {
      return (
        <Link
          href={props.href}
          className="text-ctp-blue hocus:underline hocus:text-ctp-lavender"
          {...props}
        />
      );
    }

    if (props.href?.startsWith("#")) {
      return (
        <a
          href={props.href}
          className="text-ctp-blue hocus:underline hocus:text-ctp-lavender"
          {...props}
        />
      );
    }

    return (
      <a
        className="text-ctp-blue hocus:underline hocus:text-ctp-lavender"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  ul: (props) => <ul className="list-disc ml-4" {...props} />,
  ol: (props) => <ol className="list-decimal ml-7.5" {...props} />,
  li: (props) => <li className="my-2" {...props} />,
  table: (props) => <Table {...props} />,
  thead: (props) => <TableHeader {...props} />,
  tbody: (props) => <TableBody {...props} />,
  tr: (props) => <TableRow {...props} />,
  th: (props) => <TableHead {...props} />,
  td: (props) => <TableCell {...props} />,
  code: (props) => (
    <code
      className="border border-bolder border-solid px-1.5 py-0.5 rounded-sm text-ctp-green"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
