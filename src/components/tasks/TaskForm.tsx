import { useState } from 'react';
import type { Task, Status, Priority } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addTask, updateTask } from '@/store/slices/tasksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { today } from '@/utils/helpers';

interface Props {
  task?:   Task;
  onClose: () => void;
}

const STATUSES:   Status[]   = ['todo', 'in-progress', 'done'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export default function TaskForm({ task, onClose }: Props) {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const users    = useAppSelector((s) => s.users);

  const [form, setForm] = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    assignedTo:  task?.assignedTo  ?? '',
    status:      (task?.status     ?? 'todo') as Status,
    priority:    (task?.priority   ?? 'medium') as Priority,
    dueDate:     task?.dueDate     ?? '',
    tags:        task?.tags?.join(', ') ?? '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (task) {
      dispatch(updateTask({ ...task, ...form, tags }));
      dispatch(addToast({ message: 'Task updated', variant: 'success' }));
    } else {
      dispatch(addTask({ ...form, tags, createdBy: user?.id ?? '', documents: [] }));
      dispatch(addToast({ message: 'Task created', variant: 'success' }));
    }
    onClose();
  };

  const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 transition-colors';
  const lbl = 'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={lbl}>Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Task title" required className={inp} autoFocus />
      </div>
      <div>
        <label className={lbl}>Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What needs to be done?" rows={3} className={inp + ' resize-none'} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inp}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Priority</label>
          <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className={inp}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Assign To</label>
          <select value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)} className={inp}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Due Date</label>
          <input type="date" value={form.dueDate} min={today()} onChange={(e) => set('dueDate', e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label className={lbl}>Tags</label>
        <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="frontend, ux, api" className={inp} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
          {task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
