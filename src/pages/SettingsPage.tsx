import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleTheme } from '@/store/slices/uiSlice';
import { addToast } from '@/store/slices/uiSlice';
import TopBar from '@/components/layout/TopBar';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const theme    = useAppSelector((s) => s.ui.theme);

  const clearData = () => {
    if (!confirm('Reset all app data? This cannot be undone.')) return;
    ['tf_tasks', 'tf_users', 'tf_docs', 'tf_auth'].forEach((k) => localStorage.removeItem(k));
    dispatch(addToast({ message: 'Data cleared — refresh to reload defaults', variant: 'warning' }));
  };

  const row = 'flex items-center justify-between py-4 border-b border-slate-800 last:border-0';
  const label = 'text-sm font-medium text-white';
  const sub   = 'text-xs text-slate-500 mt-0.5';

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl space-y-5">

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5">

          {/* Theme */}
          <div className={row}>
            <div>
              <p className={label}>Appearance</p>
              <p className={sub}>{theme === 'dark' ? 'Dark mode' : 'Light mode'} active</p>
            </div>
            <button onClick={() => dispatch(toggleTheme())}
              className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-600'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Account info */}
          <div className={row}>
            <div>
              <p className={label}>Account</p>
              <p className={sub}>{user?.name} · {user?.email}</p>
            </div>
            <span className="text-xs font-semibold capitalize text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              {user?.role}
            </span>
          </div>

          {/* Team */}
          <div className={row}>
            <div>
              <p className={label}>Team</p>
              <p className={sub}>{user?.team || 'No team assigned'}</p>
            </div>
          </div>

        </div>

        {/* Danger zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-5">
          <div className={row}>
            <div>
              <p className="text-sm font-medium text-red-400">Reset App Data</p>
              <p className={sub}>Clears all tasks, users, and documents from localStorage</p>
            </div>
            <button onClick={clearData}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all">
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
