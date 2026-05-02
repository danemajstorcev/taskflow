import { useAppDispatch, useAppSelector } from "@/hooks";
import { openModal } from "@/store/slices/uiSlice";
import { selectFilteredTasks } from "@/hooks";
import FiltersBar from "@/components/tasks/FiltersBar";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import ExportToolbar from "@/components/documents/ExportToolbar";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const total = useAppSelector(selectFilteredTasks).length;
  const canCreate = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-4 sm:px-6 py-3 border-b flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <FiltersBar />
          <span className="text-xs font-mono" style={{ color: "var(--text3)" }}>
            {total} tasks
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportToolbar />
          {canCreate && (
            <button
              onClick={() => dispatch(openModal({ modal: "createTask" }))}
              className="px-3.5 py-1.5 text-xs font-bold font-mono text-white hover:opacity-80 transition-opacity"
              style={{ background: "var(--accent)" }}
            >
              + New Task
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <KanbanBoard />
      </div>
    </div>
  );
}
