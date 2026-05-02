import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectDashboardStats } from "@/hooks";
import { openModal } from "@/store/slices/uiSlice";
import { formatDate, isOverdue } from "@/utils/helpers";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badges";

function Stat({
  label,
  value,
  note,
  danger,
}: {
  label: string;
  value: number;
  note: string;
  danger?: boolean;
}) {
  return (
    <div
      className="border p-4 sm:p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div
        className="text-xs font-mono uppercase tracking-widest mb-3"
        style={{ color: "var(--text3)" }}
      >
        {label}
      </div>
      <div
        className="font-display font-bold text-4xl mb-1"
        style={{ color: danger && value > 0 ? "var(--danger)" : "var(--text)" }}
      >
        {value}
      </div>
      <div className="text-xs font-mono" style={{ color: "var(--text3)" }}>
        {note}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const stats = useAppSelector(selectDashboardStats);
  const tasks = useAppSelector((s) => s.tasks);
  const users = useAppSelector((s) => s.users);

  const recent = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const done =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl space-y-6">
      <div
        className="flex items-start justify-between gap-3 flex-wrap border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            className="text-xs font-mono uppercase tracking-widest mb-1"
            style={{ color: "var(--text3)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1
            className="font-display font-bold text-2xl sm:text-3xl"
            style={{ color: "var(--text)" }}
          >
            Hello, {user?.name.split(" ")[0]}
          </h1>
        </div>
        <button
          onClick={() => dispatch(openModal({ modal: "createTask" }))}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold font-mono text-white transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)" }}
        >
          + New Task
        </button>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px"
        style={{ background: "var(--border)" }}
      >
        <Stat label="Total" value={stats.total} note={`${done}% complete`} />
        <Stat label="In Progress" value={stats.inProgress} note="active" />
        <Stat label="Done" value={stats.done} note="completed" />
        <Stat
          label="Overdue"
          value={stats.overdue}
          note="need attention"
          danger
        />
      </div>

      <div
        className="border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="flex justify-between text-xs font-mono mb-2"
          style={{ color: "var(--text2)" }}
        >
          <span>COMPLETION RATE</span>
          <span style={{ color: "var(--accent)" }}>{done}%</span>
        </div>
        <div className="h-1.5 w-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${done}%`, background: "var(--accent)" }}
          />
        </div>
        <div
          className="flex justify-between text-[11px] font-mono mt-1.5"
          style={{ color: "var(--text3)" }}
        >
          <span>{stats.todo} todo</span>
          <span>{stats.inProgress} in progress</span>
          <span>{stats.done} done</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "var(--text3)" }}
            >
              Recent Tasks
            </span>
            <button
              onClick={() => navigate("/tasks")}
              className="text-xs font-mono transition-colors"
              style={{ color: "var(--accent)" }}
            >
              View all →
            </button>
          </div>
          <div>
            {recent.map((task, i) => {
              const assignee = users.find((u) => u.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                  style={{
                    borderBottom:
                      i < recent.length - 1
                        ? `1px solid var(--border)`
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--bg2)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {task.title}
                    </p>
                    <p
                      className="text-xs font-mono mt-0.5"
                      style={{ color: "var(--text3)" }}
                    >
                      {assignee?.name ?? "Unassigned"} ·{" "}
                      {formatDate(task.createdAt)}
                    </p>
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
          <div
            className="border"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--text3)" }}
              >
                Team
              </span>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/users")}
                  className="text-xs font-mono"
                  style={{ color: "var(--accent)" }}
                >
                  Manage →
                </button>
              )}
            </div>
            <div>
              {users.slice(0, 5).map((u, i) => {
                const open = tasks.filter(
                  (t) => t.assignedTo === u.id && t.status !== "done",
                ).length;
                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{
                      borderBottom:
                        i < Math.min(users.length, 5) - 1
                          ? `1px solid var(--border)`
                          : "none",
                    }}
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "var(--accent)" }}
                    >
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {u.name}
                      </p>
                      <p
                        className="text-[10px] font-mono capitalize"
                        style={{ color: "var(--text3)" }}
                      >
                        {u.role}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text3)" }}
                    >
                      {open}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="border p-4"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--text3)" }}
            >
              By Priority
            </div>
            {(["high", "medium", "low"] as const).map((p) => {
              const count = tasks.filter((t) => t.priority === p).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const colors = {
                high: "var(--danger)",
                medium: "var(--accent)",
                low: "var(--text3)",
              };
              return (
                <div key={p} className="mb-2.5">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="uppercase" style={{ color: colors[p] }}>
                      {p}
                    </span>
                    <span style={{ color: "var(--text2)" }}>{count}</span>
                  </div>
                  <div className="h-1" style={{ background: "var(--border)" }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: colors[p],
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {overdue.length > 0 && (
        <div
          className="border p-4"
          style={{
            borderColor: "var(--danger)",
            background: "var(--danger-bg)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold font-mono uppercase tracking-widest"
              style={{ color: "var(--danger)" }}
            >
              ⚠ {overdue.length} Overdue Task{overdue.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1.5">
            {overdue.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/tasks/${t.id}`)}
                className="flex items-center justify-between text-xs font-mono cursor-pointer transition-opacity hover:opacity-70"
                style={{ color: "var(--danger)" }}
              >
                <span className="truncate">{t.title}</span>
                <span className="flex-shrink-0 ml-2">
                  {formatDate(t.dueDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
