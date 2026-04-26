import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateTask, deleteTask, attachDocument, detachDocument } from '@/store/slices/tasksSlice';
import { addToast, openModal } from '@/store/slices/uiSlice';
import TopBar from '@/components/layout/TopBar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import DocumentDropzone from '@/components/documents/DocumentDropzone';
import DocumentList from '@/components/documents/DocumentList';
import { formatDate, isOverdue } from '@/utils/helpers';
import type { Status } from '@/types';

export default function TaskDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const task     = useAppSelector((s) => s.tasks.find((t) => t.id === id));
  const users    = useAppSelector((s) => s.users);
  const user     = useAppSelector((s) => s.auth.user);
  const docs     = useAppSelector((s) => s.documents.filter((d) => task?.documents.includes(d.id)));

  const [activeTab, setActiveTab] = useState<'details' | 'docs'>('details');

  if (!task) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Task not found" />
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p>Task not found</p>
            <button onClick={() => navigate('/tasks')} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300">← Back to tasks</button>
          </div>
        </div>
      </div>
    );
  }

  const assignee  = users.find((u) => u.id === task.assignedTo);
  const creator   = users.find((u) => u.id === task.createdBy);
  const overdue   = isOverdue(task.dueDate, task.status);
  const canEdit   = user?.role === 'admin' || user?.role === 'manager' || task.createdBy === user?.id;
  const canDelete = user?.role === 'admin' || task.createdBy === user?.id;

  const handleStatusChange = (status: Status) => {
    dispatch(updateTask({ id: task.id, status }));
    dispatch(addToast({ message: `Status updated to ${status}`, variant: 'success' }));
  };

  const handleDelete = () => {
    if (!confirm('Delete this task?')) return;
    dispatch(deleteTask(task.id));
    dispatch(addToast({ message: 'Task deleted', variant: 'success' }));
    navigate('/tasks');
  };

  const handleDocUploaded = (docId: string) => {
    dispatch(attachDocument({ taskId: task.id, docId }));
  };

  const handleDetach = (docId: string) => {
    dispatch(detachDocument({ taskId: task.id, docId }));
    dispatch(addToast({ message: 'Document detached', variant: 'info' }));
  };

  const tabCls = (tab: typeof activeTab) =>
    clsx('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
      activeTab === tab
        ? 'border-indigo-500 text-indigo-400'
        : 'border-transparent text-slate-500 hover:text-white');

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Task Detail" />
      <div className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <button onClick={() => navigate('/tasks')} className="text-xs text-slate-500 hover:text-white transition-colors mb-2 flex items-center gap-1">
                ← Tasks
              </button>
              <h1 className="font-display font-bold text-white text-xl sm:text-2xl leading-snug">{task.title}</h1>
              {overdue && (
                <span className="inline-flex items-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full mt-2 font-semibold">
                  ⚠ Overdue — was due {formatDate(task.dueDate)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {canEdit && (
                <button onClick={() => dispatch(openModal({ modal: 'editTask', payload: task }))}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                  ✎ Edit
                </button>
              )}
              {canDelete && (
                <button onClick={handleDelete}
                  className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500 border border-red-500/30 rounded-lg transition-colors">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6">
          <button className={tabCls('details')} onClick={() => setActiveTab('details')}>Details</button>
          <button className={tabCls('docs')} onClick={() => setActiveTab('docs')}>
            Documents {docs.length > 0 && <span className="ml-1.5 text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full">{docs.length}</span>}
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main info */}
              <div className="lg:col-span-2 space-y-5">
                {task.description && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 rounded-xl p-4">{task.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['todo', 'in-progress', 'done'] as Status[]).map((s) => (
                      <button key={s} onClick={() => handleStatusChange(s)}
                        className={clsx('px-4 py-2 rounded-lg text-xs font-semibold border transition-all capitalize',
                          task.status === s
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-white')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {task.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar meta */}
              <div className="space-y-3">
                {[
                  { label: 'Status',   value: <StatusBadge status={task.status} /> },
                  { label: 'Priority', value: <PriorityBadge priority={task.priority} /> },
                  { label: 'Assigned', value: <span className="text-sm text-white">{assignee?.name ?? '—'}</span> },
                  { label: 'Created',  value: <span className="text-sm text-slate-300">{formatDate(task.createdAt)}</span> },
                  { label: 'Due Date', value: <span className={clsx('text-sm', overdue ? 'text-red-400' : 'text-slate-300')}>{task.dueDate ? formatDate(task.dueDate) : '—'}</span> },
                  { label: 'Reporter', value: <span className="text-sm text-slate-300">{creator?.name ?? '—'}</span> },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800/50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{label}</span>
                    {value}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="max-w-2xl space-y-5">
              <DocumentDropzone taskId={task.id} onUploaded={handleDocUploaded} />
              <DocumentList docs={docs} onDetach={handleDetach} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
