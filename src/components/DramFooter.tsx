"use client";

import { useCallback, useState } from "react";

const CONTACT_PADS_LEFT = 60;
const CONTACT_PADS_RIGHT = 60;

// Colors inspired by the Catppuccin palette from the design system
const HOVER_COLORS = [
  "var(--ctp-rosewater)",
  "var(--ctp-flamingo)",
  "var(--ctp-pink)",
  "var(--ctp-mauve)",
  "var(--ctp-red)",
  "var(--ctp-maroon)",
  "var(--ctp-peach)",
  "var(--ctp-yellow)",
  "var(--ctp-green)",
  "var(--ctp-teal)",
  "var(--ctp-sky)",
  "var(--ctp-sapphire)",
  "var(--ctp-blue)",
  "var(--ctp-lavender)",
];

function ContactPad({
  isHovered,
  onHover,
  onLeave,
  color,
}: {
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  color: string;
}) {
  return (
    <button
      className="relative w-[0.83%] cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Contact pad - facing up */}
      <div
        className="h-5 w-full rounded-t-sm transition-all duration-150 ease-out"
        style={{
          backgroundColor: isHovered ? color : "oklch(0.72 0.07 85)",
          boxShadow: isHovered
            ? `0 -4px 16px ${color}, 0 0 24px ${color}`
            : "inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)",
          transform: isHovered ? "scaleY(1.15)" : "scaleY(1)",
          transformOrigin: "bottom",
        }}
      />
      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="-inset-1 -z-10 absolute rounded-sm opacity-40 blur-md"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );
}

export function DramFooter() {
  const [hoveredPad, setHoveredPad] = useState<number | null>(null);

  const getColorForPad = useCallback((index: number) => {
    return HOVER_COLORS[index % HOVER_COLORS.length];
  }, []);

  return (
    <footer className="mt-auto w-full">
      {/* DRAM Stick - positioned at bottom, contacts facing up */}
      <div className="relative mx-auto w-full max-w-5xl px-4">
        {/* Contact Pads Container - at the top */}
        <div className="relative flex items-end justify-center gap-px rounded-t-sm border-zinc-700 border-x border-t bg-zinc-900 px-1 pt-1 pb-0.5">
          {/* Left section of pads */}
          {Array.from({ length: CONTACT_PADS_LEFT }).map((_, index) => (
            <ContactPad
              key={`pad-left-${index}`}
              isHovered={hoveredPad === index}
              onHover={() => setHoveredPad(index)}
              onLeave={() => setHoveredPad(null)}
              color={getColorForPad(index)}
            />
          ))}

          {/* Notch gap */}
          <div className="mx-0.5 h-5 w-[0.83%] bg-zinc-900" />

          {/* Right section of pads */}
          {Array.from({ length: CONTACT_PADS_RIGHT }).map((_, index) => {
            const actualIndex = CONTACT_PADS_LEFT + index;
            return (
              <ContactPad
                key={`pad-right-${index}`}
                isHovered={hoveredPad === actualIndex}
                onHover={() => setHoveredPad(actualIndex)}
                onLeave={() => setHoveredPad(null)}
                color={getColorForPad(actualIndex)}
              />
            );
          })}
        </div>

        {/* Gold edge connector strip */}
        <div className="relative h-1.5 border-amber-800/50 border-x bg-linear-to-b from-amber-600 to-amber-700" />

        {/* Main PCB body */}
        <div className="relative h-28 overflow-hidden border-zinc-800 border-x bg-zinc-950">
          {/* PCB texture / traces */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 left-8 h-px bg-zinc-600" />
            <div className="absolute top-8 right-16 left-16 h-px bg-zinc-600" />
            <div className="absolute top-12 right-12 left-12 h-px bg-zinc-600" />
            <div className="absolute right-20 bottom-8 left-20 h-px bg-zinc-600" />
          </div>

          {/* Small components on PCB */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="h-1 w-2 rounded-xs bg-zinc-700" />
            <div className="h-1 w-2 rounded-xs bg-zinc-700" />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="h-1 w-2 rounded-xs bg-zinc-700" />
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
          </div>

          {/* Mounting hole */}
          <div className="absolute bottom-4 left-8 h-3 w-3 rounded-full border-2 border-zinc-700 bg-zinc-900" />

          <div className="absolute inset-x-12 top-3 bottom-3 overflow-hidden rounded border border-zinc-700 bg-linear-to-br from-zinc-800 via-zinc-900 to-zinc-800">
            {/* Sticker texture pattern */}
            <div className="absolute inset-0 opacity-10">
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: svg always renders */}
              <svg className="h-full w-full">
                <defs>
                  <pattern
                    id="hexPattern"
                    x="0"
                    y="0"
                    width="20"
                    height="17.32"
                    patternUnits="userSpaceOnUse"
                  >
                    <polygon
                      points="10,0 20,5.77 20,17.32 10,23.09 0,17.32 0,5.77"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      transform="translate(0, -2.89)"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexPattern)" />
              </svg>
            </div>

            {/* Sticker content */}
            <div className="relative flex h-full items-center justify-between px-6">
              {/* Left side - Logo area */}
              <div className="flex items-center gap-3">
                <div className="font-bold text-xs text-zinc-400 tracking-wider">
                  STW
                </div>
              </div>

              {/* Center - Main text */}
              <div className="flex flex-col items-center">
                <span className="font-bold text-2xl text-zinc-300 tracking-[0.2em]">
                  STANLEY
                </span>
                <span className="text-[10px] text-zinc-500 tracking-[0.3em]">
                  BLOG
                </span>
              </div>

              {/* Right side - DDR badge */}
              <div className="rounded bg-zinc-700 px-2 py-1">
                <span className="font-bold text-xs text-zinc-300">DDR2058</span>
              </div>
            </div>
          </div>

          {/* Small PCB markings */}
          <div className="absolute right-4 bottom-2 font-mono text-[6px] text-zinc-600">
            REV 1.0
          </div>
        </div>

        {/* Bottom edge of PCB - this sits at the very bottom of the viewport */}
        <div className="h-2 rounded-b border-zinc-800 border-x border-b bg-zinc-900" />
      </div>
    </footer>
  );
}
