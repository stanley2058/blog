"use client";

import { ReactNode, useEffect, useState } from "react";
import { CommandInline } from "./CommandInline";

export function TypingCommandInline({
  frameInterval = 50,
  command,
  children,
}: {
  frameInterval?: number;
  command: string;
  children?: ReactNode;
}) {
  const [displayText, setDisplayText] = useState("█");

  useEffect(() => {
    let text = command;
    let buffer = "█";
    setDisplayText(buffer);

    let timer: NodeJS.Timeout | null = null;
    const createNextFrame = () => {
      return requestAnimationFrame(() => {
        if (text.length === 0) {
          setDisplayText(command);
          return;
        }
        buffer = buffer.slice(0, buffer.length - 1) + text[0] + "█";
        text = text.slice(1);
        setDisplayText(buffer);
        timer = setTimeout(() => {
          frameId = createNextFrame();
        }, frameInterval);
      });
    };
    let frameId = createNextFrame();

    return () => {
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [command, frameInterval]);

  return (
    <>
      <CommandInline>{displayText}</CommandInline>
      {displayText === command && children}
    </>
  );
}
