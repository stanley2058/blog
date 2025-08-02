"use client";

import { useEffect, useMemo, useState } from "react";

const classicLoadingTokens = ["|", "/", "-", "\\"];
const dotLoadingTokens = "⠁⠂⠄⡀⢀⠠⠐⠈".split("");
const dotInverseLoadingTokens = "⣾⣽⣻⢿⡿⣟⣯⣷".split("");

export function TextLoading({
  variant = "classic",
  rotation = "clockwise",
  interval = 500,
  className,
}: {
  variant?: "classic" | "dot" | "dot-inverse";
  rotation?: "clockwise" | "counterclockwise";
  interval?: number;
  className?: string;
}) {
  const [tokenIndex, setTokenIndex] = useState(0);
  const baseTokens = useMemo(() => {
    if (variant === "dot") return dotLoadingTokens;
    if (variant === "dot-inverse") return dotInverseLoadingTokens;
    return classicLoadingTokens;
  }, [variant]);

  const displayTokens = useMemo(() => {
    return rotation === "clockwise" ? baseTokens : [...baseTokens].reverse();
  }, [rotation, baseTokens]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokenIndex((tokenIndex) => (tokenIndex + 1) % baseTokens.length);
    }, interval / baseTokens.length);
    return () => clearInterval(timer);
  }, [baseTokens, interval]);

  return <span className={className}>{displayTokens[tokenIndex]}</span>;
}
