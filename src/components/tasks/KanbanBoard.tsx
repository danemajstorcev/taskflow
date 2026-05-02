import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectTasksByStatus } from '@/hooks';
import { moveTask, deleteTask } from '@/store/slices/tasksSlice';
import { addToast, openModal } from '@/store/slices/uiSlice';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { formatDate, isOverdue } from '@/utils/helpers';
import type { Task, Status } from '@/types';

const COLS: { status: Status; label: string }[] = [
  { status: 'todo',        label: 'To Do'       },
  { status: 'in-progress', label: 'In Progress'  },
  { status: 'done',        label: 'Done'         },
];

function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user     = useAppSelector((s) => s.auth.user);
  const users    = useAppSelector((s) => s.users);
  const docs     = useAppSelector((s) => s.documents.filter((d) => task.documents.includes(d.id)));
  const assignee = users.find((u) => u.id === task.assignedTo);
  const overdue  = isOverdue(task.dueDate, task.status);
  const canDelete = user?.role === 'admin' || user?.role === 'manager' || task.createdBy === user?.id;

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
      className="group cursor-pointer border-l-2 p-3 mb-2 transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--surface)',
        borderColor: overdue ? 'var(--danger)' : task.priority === 'high' ? 'var(--accent)' : 'var(--border)',
        borderTop: '1px solid var(--border)',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '2px 2px 0 var(--border)',
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-2">
        <p className="text-sm font-semibold leading-snug flex-1" style={{ color: 'var(--text)' }}>{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={handleEdit} className="text-xs px-1 transition-colors" style={{ color: 'var(--text3)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text3)')}>✎</button>
          {canDelete && (
            <button onClick={handleDelete} className="text-xs px-1 transition-colors" style={{ color: 'var(--text3)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--danger)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text3)')}>✕</button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs mb-2 line-clamp-2 leading-relaxed" style={{ color: 'var(--text3)' }}>{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <PriorityBadge priority={task.priority} />
        {overdue && (
          <span className="text-[10px] font-bold font-mono uppercase px-1.5 py-0.5" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            Overdue
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 border" style={{ color: 'var(--text3)', borderColor: 'var(--border)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ background: 'var(--accent)' }}>{assignee.avatar}</div>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>{assignee.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Unassigned</span>
        )}
        <div className="flex items-center gap-2">
          {docs.length > 0 && <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>📎{docs.length}</span>}
          {task.dueDate && (
            <span className="text-[11px] font-mono" style={{ color: overdue ? 'var(--danger)' : 'var(--text3)' }}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const dispatch      = useAppDispatch();
  const tasksByStatus = useAppSelector(selectTasksByStatus);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const onDragOver  = (e: React.DragEvent, s: Status) => { e.preventDefault(); setOverCol(s); };
  const onDragLeave = () => setOverCol(null);
  const onDrop = (e: React.DragEvent, s: Status) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) { dispatch(moveTask({ id, status: s })); dispatch(addToast({ message: `Moved to ${s}`, variant: 'info' })); }
    setOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      {COLS.map(({ status, label }) => {
        const colTasks = tasksByStatus[status] ?? [];
        const isOver   = overCol === status;
        return (
          <div key={status}
            onDragOver={(e) => onDragOver(e, status)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, status)}
            className="flex flex-col min-h-[300px] transition-all"
            style={{
              background: isOver ? 'var(--accent-bg)' : 'var(--bg2)',
              border: `2px solid ${isOver ? 'var(--accent)' : 'var(--border)'}`,
              outline: isOver ? '1px solid var(--accent)' : 'none',
            }}
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-bold font-mono uppercase tracking-widest" style={{ color: 'var(--text2)' }}>{label}</span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5" style={{ background: 'var(--bg)', color: 'var(--text3)' }}>
                {colTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 scrollbar-hide">
              {colTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-xs font-mono" style={{ color: 'var(--text3)' }}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
