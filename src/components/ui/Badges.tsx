import type { Status, Priority } from "@/types";

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; color: string; label: string }> = {
    todo: { bg: "var(--bg2)", color: "var(--text2)", label: "Todo" },
    "in-progress": {
      bg: "var(--info-bg)",
      color: "var(--info)",
      label: "In Progress",
    },
    done: { bg: "var(--success-bg)", color: "var(--success)", label: "Done" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 font-mono tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { bg: string; color: string }> = {
    low: { bg: "var(--bg2)", color: "var(--text3)" },
    medium: { bg: "var(--accent-bg)", color: "var(--accent)" },
    high: { bg: "var(--danger-bg)", color: "var(--danger)" },
  };
  const s = map[priority];
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 font-mono uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      {priority}
    </span>
  );
}
