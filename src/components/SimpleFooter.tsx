"use client";

import { useEffect, useState } from "react";
import { Text } from "./Text";

export function SimpleFooter() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto mb-4 flex flex-row items-center justify-center">
      <Text
        variant="sm"
        className="text-muted-foreground/60 transition-colors duration-300 ease-out hover:text-muted-foreground/90"
      >
        Stanley Wang &copy;{year}
      </Text>
    </footer>
  );
}
