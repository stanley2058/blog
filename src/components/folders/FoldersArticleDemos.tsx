"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  type LucideIcon,
  Pause,
  Play,
  RadioTower,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { type ReactNode, useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── types ─────────────────────────────────────────────── */

type Tone = "neutral" | "info" | "warning" | "danger" | "success";
type NodeKind = "folder" | "note";

interface DemoNode {
  id: string;
  label: string;
  kind: NodeKind;
  parentId: string | null;
  tone?: Tone;
  badge?: string;
}

interface LogEntry {
  label: string;
  tone?: Tone;
}

interface TreeSnapshot {
  nodes: DemoNode[];
  emptyLabel?: string;
  detachedTitle?: string;
}

interface PanelData {
  title: string;
  subtitle: string;
  tone?: Tone;
  icon?: LucideIcon;
  tree: TreeSnapshot;
}

interface BaseStep {
  title: string;
  description: string;
  logs: LogEntry[];
}

interface QueueItem {
  actor: string;
  label: string;
  state: Tone;
}

interface PrimerStep extends BaseStep {
  alice: PanelData;
  bob: PanelData;
  queue: QueueItem[];
}

interface ConflictStep extends BaseStep {
  alice: PanelData;
  bob: PanelData;
  resolved: PanelData;
}

interface CycleStep extends BaseStep {
  graph: PanelData;
  visible: PanelData;
  checks: { label: string; ok: boolean }[];
}

interface HealingStep extends BaseStep {
  raw: PanelData;
  healed: PanelData;
  checks: { label: string; state: Tone }[];
}

/* ─── constants ─────────────────────────────────────────── */

const AUTO_MS = 2400;
const ROOT = "__root__";

/* ─── data: primer ──────────────────────────────────────── */

const primerSteps: PrimerStep[] = [
  {
    title: "Same starting tree",
    description:
      "Both clients hold a local copy. Edits apply instantly, then fan out through the shared room.",
    logs: [
      { label: "Alice and Bob join the workspace", tone: "info" },
      { label: "Both render the same tree", tone: "success" },
    ],
    alice: {
      title: "Alice",
      subtitle: "Local state",
      tone: "info",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "folder1", null),
          note("note1-1", "note1-1", "folder1"),
          folder("folder2", "folder2", null),
        ],
      },
    },
    bob: {
      title: "Bob",
      subtitle: "Local state",
      tone: "info",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "folder1", null),
          note("note1-1", "note1-1", "folder1"),
          folder("folder2", "folder2", null),
        ],
      },
    },
    queue: [],
  },
  {
    title: "Alice edits locally",
    description:
      "She moves note1-1 into folder2. Her UI updates immediately; a sync op is buffered in the room.",
    logs: [
      { label: "Alice moves note1-1 → folder2", tone: "info" },
      { label: "Bob still has the old tree", tone: "neutral" },
    ],
    alice: {
      title: "Alice",
      subtitle: "After local move",
      tone: "info",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "folder1", null),
          folder("folder2", "folder2", null, "info"),
          note("note1-1", "note1-1", "folder2", "info", "moved"),
        ],
      },
    },
    bob: {
      title: "Bob",
      subtitle: "Unchanged",
      tone: "neutral",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "folder1", null),
          note("note1-1", "note1-1", "folder1"),
          folder("folder2", "folder2", null),
        ],
      },
    },
    queue: [
      { actor: "Alice", label: "move note1-1 → folder2", state: "warning" },
    ],
  },
  {
    title: "Concurrent edits",
    description:
      "Bob renames folder1 to docs before Alice's update arrives. Two ops are now in flight.",
    logs: [
      { label: "Bob renames folder1 → docs", tone: "info" },
      { label: "Both ops pending in the room", tone: "warning" },
    ],
    alice: {
      title: "Alice",
      subtitle: "Only knows her move",
      tone: "info",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "folder1", null),
          folder("folder2", "folder2", null, "info"),
          note("note1-1", "note1-1", "folder2", "info", "pending"),
        ],
      },
    },
    bob: {
      title: "Bob",
      subtitle: "Only knows his rename",
      tone: "warning",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "docs", null, "warning", "renamed"),
          note("note1-1", "note1-1", "folder1"),
          folder("folder2", "folder2", null),
        ],
      },
    },
    queue: [
      { actor: "Alice", label: "move note1-1 → folder2", state: "warning" },
      { actor: "Bob", label: "rename folder1 → docs", state: "warning" },
    ],
  },
  {
    title: "Both converge",
    description:
      "The room rebroadcasts both updates. Both clients settle on the same final tree.",
    logs: [
      { label: "Alice gets Bob's rename", tone: "success" },
      { label: "Bob gets Alice's move", tone: "success" },
      { label: "Same tree on both sides", tone: "success" },
    ],
    alice: {
      title: "Alice",
      subtitle: "Converged",
      tone: "success",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "docs", null, "success"),
          folder("folder2", "folder2", null, "success"),
          note("note1-1", "note1-1", "folder2", "success", "synced"),
        ],
      },
    },
    bob: {
      title: "Bob",
      subtitle: "Converged",
      tone: "success",
      icon: Users,
      tree: {
        nodes: [
          folder("folder1", "docs", null, "success"),
          folder("folder2", "folder2", null, "success"),
          note("note1-1", "note1-1", "folder2", "success", "synced"),
        ],
      },
    },
    queue: [{ actor: "Room", label: "all ops acknowledged", state: "success" }],
  },
];

/* ─── data: conflict ────────────────────────────────────── */

const conflictSteps: ConflictStep[] = [
  {
    title: "Starting state",
    description:
      "v1 stores whole folders as LWW objects. Unrelated fields inside the same folder can overwrite each other.",
    logs: [
      { label: "Tree is valid on both clients", tone: "neutral" },
      { label: "folder2 owns folder2-1; note1-1 in folder1", tone: "info" },
    ],
    alice: cPanel("Alice @ t0", "Baseline", "neutral", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
    bob: cPanel("Bob @ t0", "Baseline", "neutral", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
    resolved: cPanel("Merged", "No merge yet", "neutral", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
  },
  {
    title: "Alice moves the note",
    description:
      "note1-1 moves from folder1 to folder2. Both folder objects are written at t1.",
    logs: [
      { label: "Remove note1-1 from folder1", tone: "info" },
      { label: "Add note1-1 to folder2", tone: "info" },
    ],
    alice: cPanel("Alice @ t1", "After move", "info", [
      folder("folder1", "folder1", null, "neutral", "@ t1"),
      folder("folder2", "folder2", null, "info", "@ t1"),
      note("note1-1", "note1-1", "folder2", "info", "moved"),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
    bob: cPanel("Bob @ t1", "Unchanged", "neutral", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
    resolved: cPanel("Merged", "Waiting on Bob", "warning", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
  },
  {
    title: "Bob edits folder2 at t2",
    description:
      "He moves folder2-1 to root, mutating folder2's children. Since t2 > t1, Bob's folder2 object wins.",
    logs: [
      { label: "Bob moves folder2-1 → root", tone: "warning" },
      { label: "folder2 object now newer than Alice's", tone: "danger" },
    ],
    alice: cPanel("Alice @ t1", "Doesn't know about Bob", "info", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null, "info"),
      note("note1-1", "note1-1", "folder2", "info"),
      folder("folder2-1", "folder2-1", "folder2"),
    ]),
    bob: cPanel("Bob @ t2", "After his move", "warning", [
      folder("folder1", "folder1", null),
      note("note1-1", "note1-1", "folder1"),
      folder("folder2", "folder2", null, "warning", "@ t2"),
      folder("folder2-1", "folder2-1", null, "warning", "to root"),
    ]),
    resolved: cPanel("Merged", "t2 supersedes t1 on folder2", "danger", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null, "danger", "t2 wins"),
      folder("folder2-1", "folder2-1", null, "warning"),
    ]),
  },
  {
    title: "note1-1 vanishes",
    description:
      "The remove-from-folder1 survives, but the add-to-folder2 is superseded. The note is gone from every reachable folder.",
    logs: [
      { label: "folder1 removal accepted", tone: "success" },
      { label: "folder2 add superseded (t2 > t1)", tone: "danger" },
      { label: "note1-1 unreachable", tone: "danger" },
    ],
    alice: cPanel("Alice", "Broken state", "danger", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null, "danger"),
      folder("folder2-1", "folder2-1", null),
    ]),
    bob: cPanel("Bob", "Same broken state", "danger", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null, "danger"),
      folder("folder2-1", "folder2-1", null),
    ]),
    resolved: cPanel("Visible tree", "note1-1 is missing", "danger", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null, "danger"),
      folder("folder2-1", "folder2-1", null),
    ]),
  },
];

/* ─── data: cycle ───────────────────────────────────────── */

const cycleSteps: CycleStep[] = [
  {
    title: "Two folders at root",
    description: "No cycles. Both reachable from root.",
    logs: [
      { label: "Tree is a valid hierarchy", tone: "success" },
      {
        label: "Cycle risk is latent until concurrent moves merge",
        tone: "warning",
      },
    ],
    graph: yPanel("Parent graph", "Everything reachable", "neutral", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null),
    ]),
    visible: yPanel("User view", "Normal rendering", "success", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null),
    ]),
    checks: [
      { label: "Reachable from root", ok: true },
      { label: "No cycle", ok: true },
      { label: "Render path exists", ok: true },
    ],
  },
  {
    title: "Mutual moves in flight",
    description:
      "Alice: folder1 → folder2. Bob: folder2 → folder1. Neither write looks wrong alone.",
    logs: [
      { label: "Alice writes folder1.parentId = folder2", tone: "info" },
      { label: "Bob writes folder2.parentId = folder1", tone: "warning" },
    ],
    graph: yPanel("Parent graph", "Conflicting ops in flight", "warning", [
      folder("folder1", "folder1", null, "info", "→ folder2"),
      folder("folder2", "folder2", null, "warning", "→ folder1"),
    ]),
    visible: yPanel("User view", "Still normal pre-merge", "neutral", [
      folder("folder1", "folder1", null),
      folder("folder2", "folder2", null),
    ]),
    checks: [
      { label: "Reachable from root", ok: true },
      { label: "No cycle", ok: true },
      { label: "Render path exists", ok: true },
    ],
  },
  {
    title: "Detached cycle",
    description:
      "After merge, each folder's parent is the other. Root can't reach either.",
    logs: [
      { label: "Merged graph contains a cycle", tone: "danger" },
      { label: "Neither folder attached to root", tone: "danger" },
    ],
    graph: yPanel(
      "Parent graph",
      "Cycle off the root path",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger", "parent: folder2"),
        folder("folder2", "folder2", "folder1", "danger", "parent: folder1"),
      ],
      "Detached cycle",
    ),
    visible: yPanel(
      "User view",
      "Root finds nothing",
      "danger",
      [],
      undefined,
      "root has no reachable folders",
    ),
    checks: [
      { label: "Reachable from root", ok: false },
      { label: "No cycle", ok: false },
      { label: "Render path exists", ok: false },
    ],
  },
  {
    title: "Empty workspace",
    description:
      "Rendering starts at root. The detached cycle is invisible. Users see nothing.",
    logs: [
      { label: "Renderer walks from root only", tone: "neutral" },
      { label: "Folders exist but are unreachable", tone: "danger" },
    ],
    graph: yPanel(
      "Raw data",
      "Hidden cycle still present",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger", "hidden"),
        folder("folder2", "folder2", "folder1", "danger", "hidden"),
      ],
      "Detached cycle",
    ),
    visible: yPanel(
      "Rendered view",
      "What users see",
      "danger",
      [],
      "No visible folders",
      "root only",
    ),
    checks: [
      { label: "Reachable from root", ok: false },
      { label: "No cycle", ok: false },
      { label: "Render path exists", ok: false },
    ],
  },
];

/* ─── data: healing ─────────────────────────────────────── */

const healingSteps: HealingStep[] = [
  {
    title: "Same bad input",
    description:
      "v2 receives the same cyclic parent state. The difference is what happens next.",
    logs: [
      { label: "Incoming state contains a cycle", tone: "warning" },
      { label: "Repair hook about to run", tone: "info" },
    ],
    raw: hPanel(
      "Incoming state",
      "Before repair",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger", "parent: folder2"),
        folder("folder2", "folder2", "folder1", "danger", "parent: folder1"),
      ],
      "Detached cycle",
    ),
    healed: hPanel(
      "Authoritative state",
      "Not derived yet",
      "warning",
      [],
      undefined,
      "waiting for check",
    ),
    checks: [
      { label: "Detect cycle", state: "warning" },
      { label: "Pick break point", state: "neutral" },
      { label: "Re-parent to root", state: "neutral" },
    ],
  },
  {
    title: "Invariant scan",
    description:
      "The post-update hook detects the cycle and selects a deterministic repair.",
    logs: [
      { label: "Cycle identified", tone: "warning" },
      { label: "Repair strategy is deterministic", tone: "success" },
    ],
    raw: hPanel(
      "Incoming state",
      "Invalid graph",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger", "in cycle"),
        folder("folder2", "folder2", "folder1", "danger", "in cycle"),
      ],
      "Detached cycle",
    ),
    healed: hPanel("Repair engine", "Choosing folder to re-parent", "info", [
      folder("folder1", "folder1", null, "warning", "selected"),
    ]),
    checks: [
      { label: "Detect cycle", state: "success" },
      { label: "Pick break point", state: "warning" },
      { label: "Re-parent to root", state: "neutral" },
    ],
  },
  {
    title: "Cycle broken",
    description:
      "folder1 is re-parented to root. The graph becomes a valid tree again.",
    logs: [
      { label: "folder1 re-parented to root", tone: "success" },
      { label: "Graph is a tree again", tone: "success" },
    ],
    raw: hPanel(
      "Before repair",
      "Invalid graph",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger"),
        folder("folder2", "folder2", "folder1", "danger"),
      ],
      "Detached cycle",
    ),
    healed: hPanel("After repair", "Valid tree", "success", [
      folder("folder1", "folder1", null, "success", "re-parented"),
      folder("folder2", "folder2", "folder1", "success"),
    ]),
    checks: [
      { label: "Detect cycle", state: "success" },
      { label: "Pick break point", state: "success" },
      { label: "Re-parent to root", state: "success" },
    ],
  },
  {
    title: "UI stays healthy",
    description:
      "Invalid states self-heal before they persist. The same incident now resolves to a stable tree.",
    logs: [
      { label: "Root traversal works", tone: "success" },
      { label: "Both folders visible to users", tone: "success" },
    ],
    raw: hPanel(
      "Original bad input",
      "For debugging only",
      "danger",
      [
        folder("folder1", "folder1", "folder2", "danger"),
        folder("folder2", "folder2", "folder1", "danger"),
      ],
      "Detached cycle",
    ),
    healed: hPanel("Steady state", "What the product renders", "success", [
      folder("folder1", "folder1", null, "success"),
      folder("folder2", "folder2", "folder1", "success"),
    ]),
    checks: [
      { label: "Detect cycle", state: "success" },
      { label: "Pick break point", state: "success" },
      { label: "Re-parent to root", state: "success" },
    ],
  },
];

/* ─── exports ───────────────────────────────────────────── */

export function FolderSyncPrimerDemo() {
  return (
    <DemoFrame
      eyebrow="Realtime primer"
      title="Why collaborative folders felt plausible"
      accent="info"
      icon={RadioTower}
      steps={primerSteps}
      renderStep={(step, _, id) => <PrimerStepView step={step} demoId={id} />}
    />
  );
}

export function FolderLwwConflictDemo() {
  return (
    <DemoFrame
      eyebrow="V1 failure mode"
      title="Folder-level LWW drops a note"
      accent="danger"
      icon={AlertTriangle}
      steps={conflictSteps}
      renderStep={(step, _, id) => <ConflictStepView step={step} demoId={id} />}
    />
  );
}

export function FolderCycleFailureDemo() {
  return (
    <DemoFrame
      eyebrow="Structural bug"
      title="Mutual moves create a detached cycle"
      accent="warning"
      icon={Workflow}
      steps={cycleSteps}
      renderStep={(step, _, id) => <CycleStepView step={step} demoId={id} />}
    />
  );
}

export function FolderHealingDemo() {
  return (
    <DemoFrame
      eyebrow="V2 repair loop"
      title="The same bad state now self-heals"
      accent="success"
      icon={ShieldCheck}
      steps={healingSteps}
      renderStep={(step, _, id) => <HealingStepView step={step} demoId={id} />}
    />
  );
}

/* ─── demo frame ────────────────────────────────────────── */

function DemoFrame<T extends BaseStep>({
  eyebrow,
  title,
  accent,
  icon: Icon,
  steps,
  renderStep,
}: {
  eyebrow: string;
  title: string;
  accent: Tone;
  icon: LucideIcon;
  steps: T[];
  renderStep: (step: T, idx: number, demoId: string) => ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const demoId = useId().replace(/:/g, "");
  const step = steps[idx];

  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(
      () => setIdx((i) => Math.min(i + 1, steps.length - 1)),
      AUTO_MS,
    );
    return () => window.clearTimeout(t);
  }, [playing, idx, steps.length]);

  return (
    <section className="not-prose relative my-8 overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-lg backdrop-blur-sm">
      {/* accent glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(ellipse at top left, color-mix(in oklab, ${glowVar(accent)} 18%, transparent), transparent 55%)`,
        }}
      />

      <div className="relative grid gap-3 p-3 sm:gap-4 sm:p-4">
        {/* toolbar — fixed height, no per-step text */}
        <header className="grid gap-2.5 rounded-lg border border-border/70 bg-background/65 p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-[11px] uppercase tracking-[0.18em] ring-1",
                  toneBadge(accent),
                )}
              >
                <Icon className="size-3" />
                {eyebrow}
              </span>
              <p className="font-display-mono text-foreground text-sm sm:text-base">
                {title}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => {
                  setPlaying(false);
                  setIdx((i) => Math.max(i - 1, 0));
                }}
                disabled={idx === 0}
                aria-label="Previous step"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => {
                  setPlaying(false);
                  setIdx((i) => Math.min(i + 1, steps.length - 1));
                }}
                disabled={idx === steps.length - 1}
                aria-label="Next step"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setPlaying(false);
                  setIdx(i);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === idx
                    ? cn("w-6", toneSolid(accent))
                    : i < idx
                      ? cn("w-3", toneSolidMuted(accent))
                      : "w-3 bg-muted-foreground/20",
                )}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
        </header>

        {/* step content — panels sit at a stable vertical position */}
        <LayoutGroup>{renderStep(step, idx, demoId)}</LayoutGroup>

        {/* step narrative — variable-height text lives below the panels */}
        <footer className="grid gap-2 rounded-lg border border-border/70 bg-background/65 p-3 shadow-sm sm:p-4">
          <h3 className="font-display-mono text-foreground text-sm">
            {step.title}
            <span className="ml-1.5 text-muted-foreground/60">
              ({idx + 1}/{steps.length})
            </span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {step.description}
          </p>
          <div className="grid gap-1">
            {step.logs.map((entry) => (
              <div key={entry.label} className="flex items-start gap-2 text-sm">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    toneSolid(entry.tone ?? "neutral"),
                  )}
                />
                <span className="text-muted-foreground">{entry.label}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ─── step views ────────────────────────────────────────── */

function PrimerStepView({
  step,
  demoId,
}: {
  step: PrimerStep;
  demoId: string;
}) {
  return (
    <div className="grid gap-3">
      {/* sync queue — compact bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-background/65 px-3 py-2">
        <RadioTower className="size-3.5 text-ctp-sky" />
        <span className="text-[11px] text-muted-foreground uppercase leading-5 tracking-[0.18em]">
          Sync room
        </span>
        {step.queue.length > 0 ? (
          step.queue.map((item) => (
            <span
              key={`${item.actor}-${item.label}`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ring-1",
                toneBadge(item.state),
              )}
            >
              <span className="font-medium">{item.actor}</span>
              <span className="opacity-70">{item.label}</span>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground text-xs">idle</span>
        )}
      </div>

      {/* alice + bob */}
      <div className="grid gap-3 md:grid-cols-2">
        <StatePanel panelKey={`${demoId}-alice`} {...step.alice} />
        <StatePanel panelKey={`${demoId}-bob`} {...step.bob} />
      </div>
    </div>
  );
}

function ConflictStepView({
  step,
  demoId,
}: {
  step: ConflictStep;
  demoId: string;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <StatePanel panelKey={`${demoId}-alice`} {...step.alice} />
        <StatePanel panelKey={`${demoId}-bob`} {...step.bob} />
      </div>
      <StatePanel panelKey={`${demoId}-merged`} {...step.resolved} />
    </div>
  );
}

function CycleStepView({ step, demoId }: { step: CycleStep; demoId: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid gap-3">
        <StatePanel panelKey={`${demoId}-graph`} {...step.graph} />
        <StatePanel panelKey={`${demoId}-visible`} {...step.visible} />
      </div>

      {/* invariant sidebar */}
      <div className="grid content-start gap-3 rounded-lg border border-border/70 bg-background/65 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            Invariants
          </span>
          <span className="inline-flex size-7 items-center justify-center rounded-lg border border-ctp-peach/30 bg-ctp-peach/10 text-ctp-peach">
            <AlertTriangle className="size-3.5" />
          </span>
        </div>
        <div className="grid gap-2">
          {step.checks.map((check) => {
            const tone: Tone = check.ok ? "success" : "danger";
            return (
              <div
                key={check.label}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2",
                  toneSurface(tone),
                )}
              >
                <span className="text-sm">{check.label}</span>
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full ring-1",
                    toneBadge(tone),
                  )}
                >
                  {check.ok ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <AlertTriangle className="size-3.5" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-muted-foreground text-xs leading-5">
          In v1, nothing repaired this graph. Once root lost reachability, the
          UI had no path back.
        </p>
      </div>
    </div>
  );
}

function HealingStepView({
  step,
  demoId,
}: {
  step: HealingStep;
  demoId: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid gap-3">
        <StatePanel panelKey={`${demoId}-raw`} {...step.raw} />
        <StatePanel panelKey={`${demoId}-healed`} {...step.healed} />
      </div>

      {/* repair sidebar */}
      <div className="grid content-start gap-3 rounded-lg border border-border/70 bg-background/65 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            Repair
          </span>
          <span className="inline-flex size-7 items-center justify-center rounded-lg border border-ctp-green/30 bg-ctp-green/10 text-ctp-green">
            <ShieldCheck className="size-3.5" />
          </span>
        </div>
        <div className="grid gap-2">
          {step.checks.map((check) => (
            <div
              key={check.label}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2",
                toneSurface(check.state),
              )}
            >
              <span className="text-sm">{check.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ring-1",
                  toneBadge(check.state),
                )}
              >
                {check.state === "success"
                  ? "done"
                  : check.state === "warning"
                    ? "active"
                    : "queued"}
              </span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs leading-5">
          v2 treats invalid states as expected inputs that need deterministic
          cleanup, not impossible situations.
        </p>
      </div>
    </div>
  );
}

/* ─── state panel ───────────────────────────────────────── */

function StatePanel({
  panelKey,
  title,
  subtitle,
  tone = "neutral",
  icon: Icon = Folder,
  tree,
}: PanelData & { panelKey: string }) {
  const scene = useMemo(() => buildScene(tree.nodes), [tree.nodes]);

  return (
    <div className="grid gap-3 rounded-lg border border-border/70 bg-background/65 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="grid gap-0.5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            {title}
          </p>
          <p className="font-display-mono text-foreground text-sm">
            {subtitle}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-lg ring-1",
            toneBadge(tone),
          )}
        >
          <Icon className="size-3.5" />
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-card/85 to-background/80">
        <div className="border-border/70 border-b px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            <span className="size-1.5 rounded-full border border-border bg-foreground/10" />
            root
          </div>
        </div>

        <div className="grid gap-2 p-3">
          {scene.rootChildren.length > 0 ? (
            scene.rootChildren.map((node) => (
              <TreeBranch
                key={node.id}
                node={node}
                scene={scene}
                visited={new Set()}
                prefix={panelKey}
              />
            ))
          ) : (
            <div className="rounded-lg border border-border/70 border-dashed bg-card/45 px-3 py-4 text-center text-muted-foreground text-xs">
              {tree.emptyLabel ?? "no reachable children"}
            </div>
          )}

          {scene.unreachable.length > 0 ? (
            <div className="grid gap-2 rounded-lg border border-ctp-red/30 border-dashed bg-ctp-red/6 p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-ctp-red uppercase tracking-[0.18em]">
                <AlertTriangle className="size-3" />
                {tree.detachedTitle ?? "Unreachable"}
              </div>
              {scene.unreachable.map((node) => (
                <NodePill key={node.id} node={node} compact prefix={panelKey} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── tree rendering ────────────────────────────────────── */

function TreeBranch({
  node,
  scene,
  visited,
  prefix,
}: {
  node: DemoNode;
  scene: ReturnType<typeof buildScene>;
  visited: Set<string>;
  prefix: string;
}) {
  const next = new Set(visited);
  next.add(node.id);
  const children = scene.childrenByParent.get(node.id) ?? [];

  return (
    <div className="grid gap-1.5">
      <NodePill node={node} prefix={prefix} />
      {node.kind === "folder" && children.length > 0 ? (
        <div className="ml-3 border-border/60 border-l pl-3">
          <div className="grid gap-1.5">
            {children.map((child) =>
              next.has(child.id) ? (
                <div
                  key={`${node.id}-${child.id}-cycle`}
                  className="rounded-lg border border-ctp-red/30 bg-ctp-red/6 px-2.5 py-1.5 text-[11px] text-ctp-red uppercase tracking-[0.15em]"
                >
                  cycle edge skipped
                </div>
              ) : (
                <TreeBranch
                  key={child.id}
                  node={child}
                  scene={scene}
                  visited={next}
                  prefix={prefix}
                />
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NodePill({
  node,
  compact = false,
  prefix,
}: {
  node: DemoNode;
  compact?: boolean;
  prefix: string;
}) {
  const Icon = node.kind === "folder" ? Folder : FileText;

  return (
    <motion.div
      layout
      layoutId={`${prefix}-${node.id}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { type: "spring", bounce: 0.15, duration: 0.4 },
        opacity: { duration: 0.2 },
        y: { duration: 0.2 },
      }}
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors duration-300",
        toneSurface(node.tone ?? "neutral"),
        compact ? "bg-card/75" : "shadow-sm",
      )}
    >
      <span
        className={cn(
          "inline-flex size-5 items-center justify-center rounded ring-1",
          toneBadge(node.tone ?? "neutral"),
        )}
      >
        <Icon className="size-3" />
      </span>
      <span className="font-medium text-foreground text-sm">{node.label}</span>
      {node.badge ? (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ring-1",
            toneBadge(node.tone ?? "neutral"),
          )}
        >
          {node.badge}
        </span>
      ) : null}
    </motion.div>
  );
}

/* ─── tree helpers ──────────────────────────────────────── */

function buildScene(nodes: DemoNode[]) {
  const childrenByParent = new Map<string, DemoNode[]>();

  for (const node of nodes) {
    const key = node.parentId ?? ROOT;
    const list = childrenByParent.get(key) ?? [];
    list.push(node);
    childrenByParent.set(key, list);
  }

  const reachable = new Set<string>();
  const walk = (pid: string | null) => {
    for (const child of childrenByParent.get(pid ?? ROOT) ?? []) {
      if (reachable.has(child.id)) continue;
      reachable.add(child.id);
      walk(child.id);
    }
  };
  walk(null);

  return {
    childrenByParent,
    rootChildren: childrenByParent.get(ROOT) ?? [],
    unreachable: nodes.filter((n) => !reachable.has(n.id)),
  };
}

/* ─── panel factories ───────────────────────────────────── */

function cPanel(
  title: string,
  subtitle: string,
  tone: Tone,
  nodes: DemoNode[],
): PanelData {
  return { title, subtitle, tone, icon: AlertTriangle, tree: { nodes } };
}

function yPanel(
  title: string,
  subtitle: string,
  tone: Tone,
  nodes: DemoNode[],
  detachedTitle?: string,
  emptyLabel?: string,
): PanelData {
  return {
    title,
    subtitle,
    tone,
    icon: Workflow,
    tree: { nodes, detachedTitle, emptyLabel },
  };
}

function hPanel(
  title: string,
  subtitle: string,
  tone: Tone,
  nodes: DemoNode[],
  detachedTitle?: string,
  emptyLabel?: string,
): PanelData {
  return {
    title,
    subtitle,
    tone,
    icon: ShieldCheck,
    tree: { nodes, detachedTitle, emptyLabel },
  };
}

/* ─── node factories ────────────────────────────────────── */

function folder(
  id: string,
  label: string,
  parentId: string | null,
  tone: Tone = "neutral",
  badge?: string,
): DemoNode {
  return { id, label, kind: "folder", parentId, tone, badge };
}

function note(
  id: string,
  label: string,
  parentId: string | null,
  tone: Tone = "neutral",
  badge?: string,
): DemoNode {
  return { id, label, kind: "note", parentId, tone, badge };
}

/* ─── tone helpers ──────────────────────────────────────── */

function toneSurface(tone: Tone) {
  switch (tone) {
    case "info":
      return "border-ctp-sky/30 bg-ctp-sky/8";
    case "warning":
      return "border-ctp-peach/35 bg-ctp-peach/10";
    case "danger":
      return "border-ctp-red/30 bg-ctp-red/8";
    case "success":
      return "border-ctp-green/30 bg-ctp-green/8";
    default:
      return "border-border/70 bg-card/55";
  }
}

function toneBadge(tone: Tone) {
  switch (tone) {
    case "info":
      return "ring-ctp-sky/35 bg-ctp-sky/10 text-ctp-sky";
    case "warning":
      return "ring-ctp-peach/35 bg-ctp-peach/10 text-ctp-peach";
    case "danger":
      return "ring-ctp-red/35 bg-ctp-red/10 text-ctp-red";
    case "success":
      return "ring-ctp-green/35 bg-ctp-green/10 text-ctp-green";
    default:
      return "ring-border/70 bg-card/60 text-foreground";
  }
}

function toneSolid(tone: Tone) {
  switch (tone) {
    case "info":
      return "bg-ctp-sky";
    case "warning":
      return "bg-ctp-peach";
    case "danger":
      return "bg-ctp-red";
    case "success":
      return "bg-ctp-green";
    default:
      return "bg-foreground/30";
  }
}

function toneSolidMuted(tone: Tone) {
  switch (tone) {
    case "info":
      return "bg-ctp-sky/40";
    case "warning":
      return "bg-ctp-peach/40";
    case "danger":
      return "bg-ctp-red/40";
    case "success":
      return "bg-ctp-green/40";
    default:
      return "bg-foreground/20";
  }
}

function glowVar(tone: Tone): string {
  switch (tone) {
    case "info":
      return "var(--color-ctp-sky)";
    case "warning":
      return "var(--color-ctp-peach)";
    case "danger":
      return "var(--color-ctp-red)";
    case "success":
      return "var(--color-ctp-green)";
    default:
      return "var(--color-ctp-fg)";
  }
}
