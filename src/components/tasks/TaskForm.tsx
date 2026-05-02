import { useState } from "react";
import type { Task, Status, Priority } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addTask, updateTask } from "@/store/slices/tasksSlice";
import { addToast } from "@/store/slices/uiSlice";
import { today } from "@/utils/helpers";

interface Props {
  task?: Task;
  onClose: () => void;
}

const STATUSES: Status[] = ["todo", "in-progress", "done"];
const PRIORITIES: Priority[] = ["low", "medium", "high"];

export default function TaskForm({ task, onClose }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const users = useAppSelector((s) => s.users);

  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    assignedTo: task?.assignedTo ?? "",
    status: (task?.status ?? "todo") as Status,
    priority: (task?.priority ?? "medium") as Priority,
    dueDate: task?.dueDate ?? "",
    tags: task?.tags?.join(", ") ?? "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (task) {
      dispatch(updateTask({ ...task, ...form, tags }));
      dispatch(addToast({ message: "Task updated", variant: "success" }));
    } else {
      dispatch(
        addTask({ ...form, tags, createdBy: user?.id ?? "", documents: [] }),
      );
      dispatch(addToast({ message: "Task created", variant: "success" }));
    }
    onClose();
  };

  const inp = `w-full px-3 py-2 text-sm border focus:outline-none font-mono`;
  const lbl = `block text-xs font-bold uppercase tracking-widest mb-1.5 font-mono`;

  const fieldStyle = {
    background: "var(--bg)",
    borderColor: "var(--border)",
    color: "var(--text)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={lbl} style={{ color: "var(--text2)" }}>
          Title *
        </label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Task title"
          required
          className={inp}
          style={fieldStyle}
          autoFocus
        />
      </div>
      <div>
        <label className={lbl} style={{ color: "var(--text2)" }}>
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What needs to be done?"
          rows={3}
          className={`${inp} resize-none`}
          style={fieldStyle}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl} style={{ color: "var(--text2)" }}>
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={inp}
            style={fieldStyle}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl} style={{ color: "var(--text2)" }}>
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
            className={inp}
            style={fieldStyle}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl} style={{ color: "var(--text2)" }}>
            Assign To
          </label>
          <select
            value={form.assignedTo}
            onChange={(e) => set("assignedTo", e.target.value)}
            className={inp}
            style={fieldStyle}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl} style={{ color: "var(--text2)" }}>
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            min={today()}
            onChange={(e) => set("dueDate", e.target.value)}
            className={inp}
            style={fieldStyle}
          />
        </div>
      </div>
      <div>
        <label className={lbl} style={{ color: "var(--text2)" }}>
          Tags
        </label>
        <input
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="frontend, ux, api"
          className={inp}
          style={fieldStyle}
        />
      </div>
      <div
        className="flex justify-end gap-2 pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border transition-colors font-mono"
          style={{ borderColor: "var(--border)", color: "var(--text2)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold font-mono text-white transition-colors"
          style={{ background: "var(--accent)" }}
        >
          {task ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
