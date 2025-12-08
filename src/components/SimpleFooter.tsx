"use client";

import { useEffect, useState } from "react";
import { Text } from "./Text";

export function SimpleFooter() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="-translate-x-1/2 absolute bottom-4 left-1/2 flex flex-row items-center justify-center">
      <Text variant="sm" className="text-muted-foreground/60">
        Stanley Wang &copy;{year}
      </Text>
    </footer>
  );
}
