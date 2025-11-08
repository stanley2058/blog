import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function Spoiler({
  title,
  className,
  children,
}: {
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("my-2 rounded-md bg-muted px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{title ?? "Details"}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
