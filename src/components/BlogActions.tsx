"use client";

import { useMediaQuery } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Circle } from "./Circle";
import { Text } from "./Text";
import { TextLoading } from "./TextLoading";

const actions = [
  {
    key: "list-articles",
    title: "List articles",
    action: 'Go to "articles"',
    href: "/articles",
  },
  {
    key: "see-about",
    title: "See about",
    action: 'Go to "about"',
    href: "/about",
  },
  {
    key: "see-design-system",
    title: "See design system",
    action: 'Go to "design system"',
    href: "/design-system",
  },
] as const;
type ActionType = (typeof actions)[number]["key"];

export function BlogActions({
  loading = true,
  onCancel,
}: {
  loading?: boolean;
  onCancel?: () => void;
}) {
  const [selectedAction, setSelectedAction] = useState<ActionType>(
    actions[0].key,
  );
  const selectedActionEntry = actions.find((a) => a.key === selectedAction);
  const [showLoading, setShowLoading] = useState(loading);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!selectedActionEntry) return null;
  if (showLoading) return <TextLoading variant="dot-inverse" interval={250} />;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: action redirection
    <div
      className="flex flex-col pl-3"
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(selectedActionEntry.href);
        if (e.ctrlKey && e.key === "c") onCancel?.();
      }}
    >
      {actions.map((action, i) => (
        <ActionEntry
          key={action.key}
          active={selectedAction === action.key}
          onSelectSelf={() => setSelectedAction(action.key)}
          onSelectPrev={() => {
            setSelectedAction(actions[Math.max(i - 1, 0)].key);
          }}
          onSelectNext={() => {
            setSelectedAction(actions[Math.min(i + 1, actions.length - 1)].key);
          }}
        >
          {action.title}
        </ActionEntry>
      ))}

      <Text className="mt-1 mb-0.5 hidden text-ctp-pink/80 md:flex">
        [J/K/↑/↓] Navigate [Enter] Select
      </Text>

      <button
        className={cn(
          "mt-2 w-fit text-left hocus:font-semibold text-ctp-yellow",
          "focus:outine-none focus-visible:outline-none",
        )}
        onClick={() => router.push(selectedActionEntry.href)}
      >
        Enter ({selectedActionEntry.action})
      </button>
    </div>
  );
}

function ActionEntry({
  active,
  children,
  onSelectSelf,
  onSelectNext,
  onSelectPrev,
}: {
  active?: boolean;
  children: React.ReactNode;
  onSelectSelf: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
}) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!active || isSmallDevice) return;
    btnRef.current?.focus();
  }, [active, isSmallDevice]);

  return (
    <button
      ref={btnRef}
      className={cn(
        "flex w-fit flex-row items-center gap-2",
        "focus:outine-none focus-visible:outline-none",
        {
          "text-ctp-yellow": active,
        },
      )}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "k") {
          e.preventDefault();
          e.stopPropagation();
          onSelectPrev();
        }
        if (e.key === "ArrowDown" || e.key === "j") {
          e.preventDefault();
          e.stopPropagation();
          onSelectNext();
        }
      }}
      onClick={onSelectSelf}
      onFocus={onSelectSelf}
    >
      <Circle active={active} />
      <span>{children}</span>
    </button>
  );
}
