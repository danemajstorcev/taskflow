import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectDashboardStats } from '@/hooks';
import { openModal } from '@/store/slices/uiSlice';
import TopBar from '@/components/layout/TopBar';
import { formatDate, isOverdue } from '@/utils/helpers';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badges';

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={clsx('font-display font-bold text-3xl mb-1', accent ?? 'text-white')}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user     = useAppSelector((s) => s.auth.user);
  const stats    = useAppSelector(selectDashboardStats);
  const tasks    = useAppSelector((s) => s.tasks);
  const users    = useAppSelector((s) => s.users);

  const recent   = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const overdue  = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const doneRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display font-bold text-white text-xl">
              Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name.split(' ')[0]} 👋
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">Here's what's happening with your team today.</p>
          </div>
          <button onClick={() => dispatch(openModal({ modal: 'createTask' }))}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + New Task
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total Tasks"  value={stats.total}      sub={`${doneRate}% complete`} />
          <StatCard label="In Progress"  value={stats.inProgress} sub="active right now"        accent="text-indigo-400" />
          <StatCard label="Done"         value={stats.done}       sub="completed tasks"         accent="text-emerald-400" />
          <StatCard label="Overdue"      value={stats.overdue}    sub="need attention"          accent={stats.overdue > 0 ? 'text-red-400' : 'text-white'} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="text-sm font-bold text-indigo-400">{doneRate}%</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${doneRate}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>{stats.todo} todo</span>
            <span>{stats.inProgress} in progress</span>
            <span>{stats.done} done</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">Recent Tasks</h3>
              <button onClick={() => navigate('/tasks')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</button>
            </div>
            <div className="space-y-1">
              {recent.map((task) => {
                const assignee = users.find((u) => u.id === task.assignedTo);
                return (
                  <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}
                    className="flex items-center gap-3 py-2.5 border-b border-slate-800 last:border-0 cursor-pointer hover:bg-slate-800/40 -mx-2 px-2 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{assignee?.name ?? 'Unassigned'} · {formatDate(task.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4">Priority Breakdown</h3>
              <div className="space-y-3">
                {([
                  ['high',   'text-red-400',   'bg-red-500'],
                  ['medium', 'text-amber-400', 'bg-amber-500'],
                  ['low',    'text-slate-400', 'bg-slate-500'],
                ] as const).map(([p, textCls, bgCls]) => {
                  const count = tasks.filter((t) => t.priority === p).length;
                  const pct   = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={p}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={clsx('capitalize font-medium', textCls)}>{p}</span>
                        <span className="text-slate-500">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={clsx('h-full rounded-full opacity-70', bgCls)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-sm">Team</h3>
                {user?.role === 'admin' && (
                  <button onClick={() => navigate('/users')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Manage →</button>
                )}
              </div>
              <div className="space-y-2.5">
                {users.slice(0, 5).map((u) => {
                  const open = tasks.filter((t) => t.assignedTo === u.id && t.status !== 'done').length;
                  return (
                    <div key={u.id} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{u.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{u.role}</p>
                      </div>
                      <span className="text-xs text-slate-500">{open} open</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {overdue.length > 0 && (
          <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-400 text-sm">⚠</span>
              <span className="text-sm font-semibold text-red-400">{overdue.length} Overdue Task{overdue.length > 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-1.5">
              {overdue.slice(0, 3).map((t) => (
                <div key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                  className="flex items-center justify-between text-xs text-red-300 cursor-pointer hover:text-white transition-colors">
                  <span className="truncate">{t.title}</span>
                  <span className="text-red-500 flex-shrink-0 ml-2">{formatDate(t.dueDate)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
