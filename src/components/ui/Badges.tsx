import clsx from 'clsx';
import type { Status, Priority } from '@/types';

interface BadgeProps { label: string; className?: string }

export function Badge({ label, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide', className)}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    'todo':        'bg-slate-700 text-slate-300',
    'in-progress': 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    'done':        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };
  const labels: Record<Status, string> = {
    'todo': 'Todo', 'in-progress': 'In Progress', 'done': 'Done',
  };
  return <Badge label={labels[status]} className={map[status]} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, string> = {
    low:    'bg-slate-700 text-slate-400',
    medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    high:   'bg-red-500/15 text-red-400 border border-red-500/30',
  };
  const dots: Record<Priority, string> = { low: '·', medium: '●', high: '⬤' };
  return <Badge label={`${dots[priority]} ${priority}`} className={map[priority]} />;
}
