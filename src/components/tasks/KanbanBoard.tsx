import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectTasksByStatus } from '@/hooks';
import { moveTask, deleteTask } from '@/store/slices/tasksSlice';
import { addToast, openModal } from '@/store/slices/uiSlice';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { formatDate, isOverdue } from '@/utils/helpers';
import type { Task, Status } from '@/types';

const COLS: { status: Status; label: string; color: string }[] = [
  { status: 'todo',        label: 'To Do',       color: 'border-slate-700' },
  { status: 'in-progress', label: 'In Progress',  color: 'border-indigo-500/40' },
  { status: 'done',        label: 'Done',         color: 'border-emerald-500/40' },
];

function TaskCard({ task }: { task: Task }) {
  const dispatch    = useAppDispatch();
  const navigate    = useNavigate();
  const user        = useAppSelector((s) => s.auth.user);
  const users       = useAppSelector((s) => s.users);
  const docs        = useAppSelector((s) => s.documents.filter((d) => task.documents.includes(d.id)));
  const assignee    = users.find((u) => u.id === task.assignedTo);
  const overdue     = isOverdue(task.dueDate, task.status);
  const canDelete   = user?.role === 'admin' || user?.role === 'manager' || task.createdBy === user?.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    dispatch(deleteTask(task.id));
    dispatch(addToast({ message: 'Task deleted', variant: 'success' }));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal({ modal: 'editTask', payload: task }));
  };

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={clsx(
        'bg-slate-800 border rounded-xl p-3.5 cursor-pointer group',
        'hover:border-indigo-500/50 hover:bg-slate-750 transition-all',
        overdue ? 'border-red-500/30' : 'border-slate-700'
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-white leading-snug flex-1">{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={handleEdit} className="w-5 h-5 text-slate-500 hover:text-white text-xs transition-colors">✎</button>
          {canDelete && <button onClick={handleDelete} className="w-5 h-5 text-slate-500 hover:text-red-400 text-xs transition-colors">✕</button>}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2.5 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
        <PriorityBadge priority={task.priority} />
        {overdue && <span className="text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Overdue</span>}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">{assignee.avatar}</div>
            <span className="text-[11px] text-slate-500">{assignee.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-600">Unassigned</span>
        )}
        <div className="flex items-center gap-2">
          {docs.length > 0 && <span className="text-[11px] text-slate-500">📎 {docs.length}</span>}
          {task.dueDate && (
            <span className={clsx('text-[11px]', overdue ? 'text-red-400' : 'text-slate-500')}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const dispatch     = useAppDispatch();
  const tasksByStatus = useAppSelector(selectTasksByStatus);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const onDragOver  = (e: React.DragEvent, status: Status) => { e.preventDefault(); setOverCol(status); };
  const onDragLeave = () => setOverCol(null);
  const onDrop      = (e: React.DragEvent, status: Status) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) { dispatch(moveTask({ id, status })); dispatch(addToast({ message: `Moved to ${status}`, variant: 'info' })); }
    setOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      {COLS.map(({ status, label, color }) => {
        const colTasks = tasksByStatus[status] ?? [];
        return (
          <div
            key={status}
            onDragOver={(e) => onDragOver(e, status)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, status)}
            className={clsx(
              'flex flex-col rounded-xl border-2 transition-all',
              overCol === status ? 'border-indigo-500 bg-indigo-500/5' : `${color} bg-slate-900/50`
            )}
          >
            <div className="px-3.5 py-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[200px] scrollbar-hide">
              {colTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-24 text-slate-700 text-xs">Drop tasks here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
