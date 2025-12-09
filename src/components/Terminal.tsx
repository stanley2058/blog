"use client";

import { LucideChevronRight } from "lucide-react";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { createStore, useStore } from "zustand";
import { BlogActions } from "./BlogActions";
import { CommandInline } from "./CommandInline";
import { WhoAmICard } from "./WhoAmICard";

const validCommands = [
  "whoami",
  "history",
  "clear",
  ...["?", "h", "help"],
  "blog",
] as const;

function handleRunCommand({
  cmd,
  args,
  history,
}: {
  cmd: string;
  args?: string[];
  history: string[];
}) {
  switch (cmd) {
    case "whoami":
      return { output: <WhoAmICard headless />, error: false };
    case "history":
      return {
        output: (
          <div className="flex flex-col">
            {history.map((cmd, i) => (
              <span key={i}>
                {i}::{cmd}
              </span>
            ))}
          </div>
        ),
        error: false,
      };
    case "clear":
      terminalState.getState().clearCommandEntries();
      return null;
    case "blog": {
      const { promise, resolve } = Promise.withResolvers<void>();
      return {
        output: <BlogActions loading={false} onCancel={resolve} />,
        error: false,
        block: promise.then(() => {
          const { commandEntries } = terminalState.getState();
          const last = commandEntries.at(-1);
          if (!last) return;
          last.output = null;
          terminalState.setState({ commandEntries: [...commandEntries] });
        }),
      };
    }
    case "?":
    case "help":
    case "h":
      return {
        output: (
          <div className="flex flex-col">
            <span className="font-semibold">Supported commands:</span>
            <span>
              <span className="font-semibold text-ctp-green">whoami</span>
              {` show the whoami card`}
            </span>
            <span>
              <span className="font-semibold text-ctp-green">history</span>
              {` show command history`}
            </span>
            <span>
              <span className="font-semibold text-ctp-green">clear</span>
              {` clear the terminal output`}
            </span>
            <span>
              {["?", "h", "help"].map((cmd, i) => (
                <Fragment key={cmd}>
                  {i > 0 && ", "}
                  <span className="font-semibold text-ctp-green">{cmd}</span>
                </Fragment>
              ))}
              {` show this help message`}
            </span>
          </div>
        ),
        error: false,
      };
    default:
      return {
        output: <span>{`"${cmd}" is not a valid command.`}</span>,
        error: true,
      };
  }
}

interface CommandEntry {
  command: string;
  output?: ReactNode;
  error?: boolean;
}

interface TerminalState {
  history: string[];
  addHistory: (cmd: string) => void;
  commandEntries: CommandEntry[];
  addCommandEntry: (entry: CommandEntry) => void;
  clearCommandEntries: () => void;
}

const terminalState = createStore<TerminalState>((set) => ({
  history: [],
  addHistory: (cmd: string) => set((s) => ({ history: [...s.history, cmd] })),
  commandEntries: [],
  addCommandEntry: (entry: CommandEntry) =>
    set((s) => ({ commandEntries: [...s.commandEntries, entry] })),
  clearCommandEntries: () => set({ commandEntries: [] }),
}));

export function Terminal({ autoFocus = true }: { autoFocus?: boolean }) {
  const [blockedBy, setBlockedBy] = useState<Promise<void> | null>(null);
  const commandEntries = useStore(terminalState, (s) => s.commandEntries);

  useEffect(() => {
    if (!blockedBy) return;
    const { promise, resolve } = Promise.withResolvers<void>();
    Promise.race([blockedBy.then(() => setBlockedBy(null)), promise]);
    return resolve;
  }, [blockedBy]);

  return (
    <div className="h-full w-full">
      {commandEntries.map((entry, i) => (
        <div key={i}>
          <CommandInline className={entry.error ? "text-ctp-red" : undefined}>
            {entry.command}
          </CommandInline>
          {entry.output}
        </div>
      ))}

      <ShellInput
        blocked={Boolean(blockedBy)}
        onSubmit={(fullCommand) => {
          const tokens = fullCommand.split(" ");
          const { block, ...commandResult } =
            handleRunCommand({
              cmd: tokens[0],
              args: tokens.slice(1),
              history: terminalState.getState().history,
            }) || {};
          if (block) setBlockedBy(block);
          if (!commandResult) return;
          terminalState.getState().addCommandEntry({
            command: fullCommand,
            ...commandResult,
          });
        }}
        onClearScreen={() => terminalState.getState().clearCommandEntries()}
        autoFocus={autoFocus}
        scrollIntoView={autoFocus}
      />
    </div>
  );
}

function ShellInput({
  blocked,
  onSubmit,
  onClearScreen,
  autoFocus,
  scrollIntoView,
}: {
  blocked?: boolean;
  onSubmit?: (fullCommand: string) => void;
  onClearScreen?: () => void;
  autoFocus?: boolean;
  scrollIntoView?: boolean;
}) {
  const historyIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<{ index: number; prefix: string }>({
    index: -1,
    prefix: "",
  });
  const [inputText, setInputText] = useState("");

  const tokens = inputText.split(" ");
  const command = tokens[0];
  const args = tokens.slice(1);
  const commandValid = (validCommands as readonly string[]).includes(command);
  const addHistory = useStore(terminalState, (s) => s.addHistory);

  useEffect(() => {
    if (blocked || !autoFocus) return;
    inputRef.current?.focus();
  }, [blocked, autoFocus]);

  if (blocked) return null;
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: action redirection
    <div
      ref={containerRef}
      className="group/shell-input grid w-full cursor-text grid-cols-[auto_1fr]"
      onClick={() => inputRef.current?.focus()}
    >
      <LucideChevronRight className="text-ctp-green" />
      <span className="wrap-anywhere max-w-full whitespace-pre-wrap text-wrap">
        {command && (
          <span className={commandValid ? "text-ctp-green" : "text-ctp-red"}>
            {command}
          </span>
        )}
        {args?.length ? ` ${args.join(" ")}` : ""}

        <span className="animate-cursor-pulse group-focus-within/shell-input:animate-none">
          █
        </span>
      </span>

      <input
        ref={inputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="absolute z-[-1] w-0 opacity-0"
        onFocus={() => {
          if (!inputRef.current) return;
          inputRef.current.selectionStart = inputRef.current.value.length;
          inputRef.current.selectionEnd = inputRef.current.value.length;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addHistory(inputText);
            onSubmit?.(inputText);
            setInputText("");
            if (scrollIntoView) containerRef.current?.scrollIntoView();
            return;
          }
          if (e.ctrlKey && e.key === "l") {
            onClearScreen?.();
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          if (e.key === "ArrowUp") {
            const history = terminalState.getState().history;
            if (
              historyIndexRef.current === -1 ||
              history[historyIndexRef.current] !== inputText
            ) {
              historyIndexRef.current = history.length - 1;
            } else {
              historyIndexRef.current = Math.max(
                0,
                historyIndexRef.current - 1,
              );
            }

            const prev = history[historyIndexRef.current];
            if (!prev) return;
            setInputText(prev);
            if (scrollIntoView) containerRef.current?.scrollIntoView();
            return;
          }
          if (e.key === "ArrowDown") {
            if (historyIndexRef.current === -1) return;
            const history = terminalState.getState().history;
            if (historyIndexRef.current === history.length - 1) {
              setInputText("");
              if (scrollIntoView) containerRef.current?.scrollIntoView();
              historyIndexRef.current = -1;
              return;
            } else {
              historyIndexRef.current = Math.min(
                history.length - 1,
                historyIndexRef.current + 1,
              );
            }
            const next = history[historyIndexRef.current];
            if (!next) return;
            setInputText(next);
            if (scrollIntoView) containerRef.current?.scrollIntoView();
            return;
          }
          if (e.ctrlKey && e.key === "c") {
            setInputText("");
            if (scrollIntoView) containerRef.current?.scrollIntoView();
            return;
          }
          if (e.key === "Tab") {
            if (inputText.trim() === "") return;
            if (inputText !== autoCompleteRef.current.prefix) {
              autoCompleteRef.current.index = 0;
            } else {
              autoCompleteRef.current.index++;
            }
            const suggestion = validCommands.filter((cmd) =>
              cmd.startsWith(inputText),
            )?.[autoCompleteRef.current.index];

            if (suggestion) setInputText(suggestion);

            e.preventDefault();
            e.stopPropagation();
            return;
          }
        }}
      />
    </div>
  );
}
