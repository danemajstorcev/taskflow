import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  updateTask,
  deleteTask,
  attachDocument,
  detachDocument,
} from "@/store/slices/tasksSlice";
import { addToast, openModal } from "@/store/slices/uiSlice";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import DocumentDropzone from "@/components/documents/DocumentDropzone";
import DocumentList from "@/components/documents/DocumentList";
import { formatDate, isOverdue } from "@/utils/helpers";
import type { Status } from "@/types";

const STATUSES: Status[] = ["todo", "in-progress", "done"];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const task = useAppSelector((s) => s.tasks.find((t) => t.id === id));
  const users = useAppSelector((s) => s.users);
  const user = useAppSelector((s) => s.auth.user);
  const docs = useAppSelector((s) =>
    s.documents.filter((d) => task?.documents.includes(d.id)),
  );

  const [tab, setTab] = useState<"details" | "docs">("details");

  if (!task) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--text3)" }}>
        <div className="text-4xl mb-3">404</div>
        <p className="text-sm font-mono mb-4">Task not found</p>
        <button
          onClick={() => navigate("/tasks")}
          className="text-xs font-mono underline"
          style={{ color: "var(--accent)" }}
        >
          ← Back to tasks
        </button>
      </div>
    );
  }

  const assignee = users.find((u) => u.id === task.assignedTo);
  const creator = users.find((u) => u.id === task.createdBy);
  const overdue = isOverdue(task.dueDate, task.status);
  const canEdit =
    user?.role === "admin" ||
    user?.role === "manager" ||
    task.createdBy === user?.id;
  const canDelete = user?.role === "admin" || task.createdBy === user?.id;

  const handleStatusChange = (status: Status) => {
    dispatch(updateTask({ id: task.id, status }));
    dispatch(addToast({ message: `Status → ${status}`, variant: "success" }));
  };

  const handleDelete = () => {
    if (!confirm("Delete this task?")) return;
    dispatch(deleteTask(task.id));
    dispatch(addToast({ message: "Task deleted", variant: "success" }));
    navigate("/tasks");
  };

  return (
    <div className="max-w-4xl">
      <div
        className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b flex-wrap"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="flex items-center gap-2 text-xs font-mono"
          style={{ color: "var(--text3)" }}
        >
          <button
            onClick={() => navigate("/tasks")}
            className="hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Tasks
          </button>
          <span>/</span>
          <span className="truncate max-w-[180px]">{task.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() =>
                dispatch(openModal({ modal: "editTask", payload: task }))
              }
              className="px-3 py-1.5 text-xs font-mono border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text2)" }}
            >
              ✎ Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-mono border transition-colors"
              style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h1
          className="font-display font-bold text-2xl sm:text-3xl mb-2 leading-tight"
          style={{ color: "var(--text)" }}
        >
          {task.title}
        </h1>

        {overdue && (
          <div
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase px-2.5 py-1 mb-3 border"
            style={{
              color: "var(--danger)",
              borderColor: "var(--danger)",
              background: "var(--danger-bg)",
            }}
          >
            ⚠ Overdue — was due {formatDate(task.dueDate)}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div
          className="flex border-b mb-5"
          style={{ borderColor: "var(--border)" }}
        >
          {(["details", "docs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 -mb-px transition-colors"
              style={{
                borderColor: tab === t ? "var(--accent)" : "transparent",
                color: tab === t ? "var(--accent)" : "var(--text3)",
              }}
            >
              {t === "docs" ? `Documents (${docs.length})` : "Details"}
            </button>
          ))}
        </div>

        {tab === "details" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {task.description && (
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-2"
                    style={{ color: "var(--text3)" }}
                  >
                    Description
                  </div>
                  <p
                    className="text-sm leading-relaxed p-4 border"
                    style={{
                      color: "var(--text2)",
                      borderColor: "var(--border)",
                      background: "var(--bg2)",
                    }}
                  >
                    {task.description}
                  </p>
                </div>
              )}

              <div>
                <div
                  className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: "var(--text3)" }}
                >
                  Move Status
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="px-4 py-2 text-xs font-mono border transition-all capitalize"
                      style={{
                        borderColor:
                          task.status === s ? "var(--accent)" : "var(--border)",
                        background:
                          task.status === s
                            ? "var(--accent-bg)"
                            : "var(--surface)",
                        color:
                          task.status === s ? "var(--accent)" : "var(--text2)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {task.tags.length > 0 && (
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-2"
                    style={{ color: "var(--text3)" }}
                  >
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 py-0.5 border"
                        style={{
                          color: "var(--text2)",
                          borderColor: "var(--border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="border divide-y"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              {[
                { label: "Assigned To", value: assignee?.name ?? "—" },
                { label: "Reporter", value: creator?.name ?? "—" },
                { label: "Created", value: formatDate(task.createdAt) },
                {
                  label: "Due Date",
                  value: task.dueDate ? formatDate(task.dueDate) : "—",
                  danger: overdue,
                },
                { label: "Team", value: assignee?.team ?? "—" },
              ].map(({ label, value, danger }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text3)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: danger ? "var(--danger)" : "var(--text)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl space-y-5">
            <DocumentDropzone
              taskId={task.id}
              onUploaded={(docId) =>
                dispatch(attachDocument({ taskId: task.id, docId }))
              }
            />
            <DocumentList
              docs={docs}
              onDetach={(docId) => {
                dispatch(detachDocument({ taskId: task.id, docId }));
                dispatch(
                  addToast({ message: "Document detached", variant: "info" }),
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
