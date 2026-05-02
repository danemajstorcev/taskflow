import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addUser, removeUser, changeRole } from '@/store/slices/usersSlice';
import { addToast } from '@/store/slices/uiSlice';
import type { Role } from '@/types';

const ROLE_COLOR: Record<Role, string> = {
  admin:   'var(--danger)',
  manager: 'var(--accent)',
  user:    'var(--text3)',
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
      <div className="p-8 text-center" style={{ color: 'var(--text3)' }}>
        <div className="text-4xl mb-3 font-mono">403</div>
        <p className="text-sm font-mono">Admin access required</p>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    dispatch(addUser({ ...form, avatar: initials }));
    dispatch(addToast({ message: `${form.name} added to team`, variant: 'success' }));
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
    if (id === user.id) { dispatch(addToast({ message: "Can't change your own role", variant: 'warning' })); return; }
    dispatch(changeRole({ id, role }));
    dispatch(addToast({ message: 'Role updated', variant: 'success' }));
  };

  const inp = 'w-full px-3 py-2 text-sm border focus:outline-none font-mono';
  const fieldStyle = { background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="p-4 sm:p-6 max-w-5xl space-y-5">

      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Team</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text3)' }}>{users.length} members</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 text-xs font-bold font-mono text-white hover:opacity-80 transition-opacity"
          style={{ background: showForm ? 'var(--text3)' : 'var(--accent)' }}>
          {showForm ? '× Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border p-5 space-y-3"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>New Team Member</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name *" required className={inp} style={fieldStyle} />
            <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email *" type="email" required className={inp} style={fieldStyle} />
            <input value={form.team} onChange={(e) => setForm((p) => ({ ...p, team: e.target.value }))}
              placeholder="Team / Department" className={inp} style={fieldStyle} />
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}
              className={inp} style={fieldStyle}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-mono border" style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-xs font-bold font-mono text-white" style={{ background: 'var(--accent)' }}>
              Add Member
            </button>
          </div>
        </form>
      )}

      <div className="border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
                {['Member', 'Role', 'Team', 'Open Tasks', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-mono uppercase tracking-widest px-4 py-2.5"
                    style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const open = tasks.filter((t) => t.assignedTo === u.id && t.status !== 'done').length;
                const isMe = u.id === user.id;
                return (
                  <tr key={u.id} className="border-b last:border-0 transition-colors"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg2)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--surface)')}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'var(--accent)' }}>{u.avatar}</div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {u.name} {isMe && <span className="text-[10px] font-mono" style={{ color: 'var(--accent)' }}>(you)</span>}
                          </p>
                          <p className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <select value={u.role} disabled={isMe} onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                        className="text-xs font-mono font-bold uppercase px-2 py-1 border appearance-none cursor-pointer disabled:cursor-default bg-transparent"
                        style={{ color: ROLE_COLOR[u.role], borderColor: ROLE_COLOR[u.role] + '40' }}>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--text2)' }}>{u.team || '—'}</td>
                    <td className="px-4 py-3.5 text-xs font-mono font-bold" style={{ color: open > 0 ? 'var(--accent)' : 'var(--text3)' }}>{open}</td>
                    <td className="px-4 py-3.5">
                      {!isMe && (
                        <button onClick={() => handleRemove(u.id, u.name)}
                          className="text-xs font-mono transition-colors"
                          style={{ color: 'var(--text3)' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--danger)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text3)')}>
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
  );
}
