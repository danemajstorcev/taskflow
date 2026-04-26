import { useAppDispatch, useAppSelector } from '@/hooks';
import { setStatus, setPriority, setAssignedTo, setSortBy, resetFilters } from '@/store/slices/filtersSlice';
import type { Status, Priority, FiltersState } from '@/types';

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters  = useAppSelector((s) => s.filters);
  const users    = useAppSelector((s) => s.users);
  const hasActive = filters.status || filters.priority || filters.assignedTo || filters.search;

  const sel = 'bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select value={filters.status} onChange={(e) => dispatch(setStatus(e.target.value as Status | ''))} className={sel}>
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select value={filters.priority} onChange={(e) => dispatch(setPriority(e.target.value as Priority | ''))} className={sel}>
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={filters.assignedTo} onChange={(e) => dispatch(setAssignedTo(e.target.value))} className={sel}>
        <option value="">All Users</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>

      <select value={filters.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as FiltersState['sortBy']))} className={sel}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
      </select>

      {hasActive && (
        <button onClick={() => dispatch(resetFilters())}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium px-2 py-1.5">
          Clear
        </button>
      )}
    </div>
  );
}
