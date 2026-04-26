import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login } from '@/store/slices/authSlice';
import type { User } from '@/types';

const DEMO_USERS: (User & { password: string })[] = [
  { id: 'u1', name: 'Dana Kovač',    email: 'dana@taskflow.io',   password: 'admin123',   role: 'admin',   avatar: 'DK', team: 'Management',  createdAt: '2024-01-10' },
  { id: 'u2', name: 'Lena Horváth',  email: 'lena@taskflow.io',   password: 'manager123', role: 'manager', avatar: 'LH', team: 'Product',     createdAt: '2024-02-14' },
  { id: 'u3', name: 'Marco Rossi',   email: 'marco@taskflow.io',  password: 'user123',    role: 'user',    avatar: 'MR', team: 'Engineering', createdAt: '2024-03-01' },
];

export default function LoginPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const isAuth    = useAppSelector((s) => s.auth.isAuthenticated);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  if (isAuth) { navigate('/dashboard'); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) { setError('Invalid credentials'); return; }
    const { password: _, ...user } = found;
    dispatch(login(user));
    navigate('/dashboard');
  };

  const quickLogin = (u: typeof DEMO_USERS[0]) => {
    const { password: _, ...user } = u;
    dispatch(login(user));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-white font-bold text-lg">TF</span>
          </div>
          <h1 className="font-display font-bold text-white text-2xl">TaskFlow</h1>
          <p className="text-slate-500 text-sm mt-1">Enterprise Workflow Management</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@taskflow.io"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
              Sign In
            </button>
          </form>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500 mb-3 text-center">Quick demo access</p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button key={u.id} onClick={() => quickLogin(u)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/40 rounded-lg transition-all group">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{u.avatar}</div>
                  <div className="text-left flex-1">
                    <div className="text-xs font-semibold text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-500">{u.email} · <span className="capitalize">{u.role}</span></div>
                  </div>
                  <span className="text-slate-600 group-hover:text-indigo-400 text-xs transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
