import { useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addUser, removeUser, changeRole } from '@/store/slices/usersSlice';
import { addToast } from '@/store/slices/uiSlice';
import TopBar from '@/components/layout/TopBar';
import { uid, today } from '@/utils/helpers';
import type { Role } from '@/types';

const ROLE_STYLES: Record<Role, string> = {
  admin:   'bg-violet-500/15 text-violet-400 border-violet-500/30',
  manager: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  user:    'bg-slate-700 text-slate-300 border-slate-600',
};

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const users    = useAppSelector((s) => s.users);
  const tasks    = useAppSelector((s) => s.tasks);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' as Role, team: '' });

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Users" />
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-sm">Admin access required</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    dispatch(addUser({ ...form, avatar: initials }));
    dispatch(addToast({ message: `${form.name} added`, variant: 'success' }));
    setForm({ name: '', email: '', role: 'user', team: '' });
    setShowForm(false);
  };

  const handleRemove = (id: string, name: string) => {
    if (id === user.id) { dispatch(addToast({ message: "You can't remove yourself", variant: 'error' })); return; }
    if (!confirm(`Remove ${name}?`)) return;
    dispatch(removeUser(id));
    dispatch(addToast({ message: `${name} removed`, variant: 'success' }));
  };

  const handleRoleChange = (id: string, role: Role) => {
    if (id === user.id) { dispatch(addToast({ message: "You can't change your own role", variant: 'warning' })); return; }
    dispatch(changeRole({ id, role }));
    dispatch(addToast({ message: 'Role updated', variant: 'success' }));
  };

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500';

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Users" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-slate-500">{users.length} team member{users.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
            {showForm ? '× Cancel' : '+ Add User'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-white text-sm mb-4">New Team Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name *" required className={inputCls} />
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email *" type="email" required className={inputCls} />
              <input value={form.team} onChange={(e) => setForm((p) => ({ ...p, team: e.target.value }))}
                placeholder="Team / Department" className={inputCls} />
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))} className={inputCls}>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">Add Member</button>
            </div>
          </form>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Member', 'Role', 'Team', 'Tasks Assigned', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  const assigned = tasks.filter((t) => t.assignedTo === u.id).length;
                  const isMe     = u.id === user.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{u.avatar}</div>
                          <div>
                            <p className="font-medium text-white text-sm">{u.name} {isMe && <span className="text-[10px] text-indigo-400">(you)</span>}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={u.role}
                          disabled={isMe}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none bg-transparent cursor-pointer disabled:cursor-default', ROLE_STYLES[u.role])}
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{u.team || '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{assigned}</td>
                      <td className="px-4 py-3.5">
                        {!isMe && (
                          <button onClick={() => handleRemove(u.id, u.name)}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors font-medium">
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
