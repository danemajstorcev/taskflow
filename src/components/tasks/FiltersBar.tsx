import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setStatus,
  setPriority,
  setAssignedTo,
  setSortBy,
  setSearch,
  resetFilters,
} from "@/store/slices/filtersSlice";
import type { Status, Priority, FiltersState } from "@/types";

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const users = useAppSelector((s) => s.users);
  const hasActive =
    filters.status || filters.priority || filters.assignedTo || filters.search;

  const sel = `bg-base border border-base text-base text-sm px-2.5 py-1.5 focus:outline-none focus:border-base2 font-mono appearance-none cursor-pointer`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Search…"
        value={filters.search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className={`${sel} sm:hidden w-full`}
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />

      <select
        value={filters.status}
        onChange={(e) => dispatch(setStatus(e.target.value as Status | ""))}
        className={sel}
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => dispatch(setPriority(e.target.value as Priority | ""))}
        className={sel}
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.assignedTo}
        onChange={(e) => dispatch(setAssignedTo(e.target.value))}
        className={sel}
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        <option value="">All Users</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) =>
          dispatch(setSortBy(e.target.value as FiltersState["sortBy"]))
        }
        className={sel}
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
      </select>

      {hasActive && (
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-mono px-2 py-1.5 transition-colors"
          style={{ color: "var(--accent)" }}
        >
          × Clear
        </button>
      )}
    </div>
  );
}
