import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleSidebar, toggleTheme } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard'  },
  { to: '/tasks',     icon: '✓', label: 'Tasks'       },
  { to: '/users',     icon: '◎', label: 'Users'       },
  { to: '/documents', icon: '📁', label: 'Documents'  },
  { to: '/settings',  icon: '⚙', label: 'Settings'   },
];

export default function Sidebar() {
  const dispatch    = useAppDispatch();
  const navigate    = useNavigate();
  const user        = useAppSelector((s) => s.auth.user);
  const open        = useAppSelector((s) => s.ui.sidebarOpen);
  const theme       = useAppSelector((s) => s.ui.theme);
  const visibleNav  = user?.role === 'user'
    ? NAV.filter((n) => n.to !== '/users')
    : NAV;

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <aside className={clsx(
      'fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300',
      'bg-slate-900 dark:bg-slate-950 border-r border-slate-800',
      open ? 'w-56' : 'w-14'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 h-14 border-b border-slate-800 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">TF</span>
        </div>
        {open && (
          <span className="font-display font-bold text-white text-sm tracking-tight">TaskFlow</span>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="ml-auto text-slate-500 hover:text-white transition-colors text-base"
        >
          {open ? '◂' : '▸'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {visibleNav.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user + theme */}
      <div className="px-2 pb-4 space-y-1 border-t border-slate-800 pt-3">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all w-full"
        >
          <span className="text-base w-5 text-center flex-shrink-0">{theme === 'dark' ? '○' : '●'}</span>
          {open && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.avatar}
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <span className="text-base w-5 text-center flex-shrink-0">↩</span>
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
