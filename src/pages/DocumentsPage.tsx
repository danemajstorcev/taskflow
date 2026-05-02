import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectFilteredTasks } from "@/hooks";
import { addToast } from "@/store/slices/uiSlice";
import {
  exportTasksToExcel,
  exportTasksToWord,
  exportTasksToPDF,
} from "@/utils/docUtils";
import DocumentDropzone from "@/components/documents/DocumentDropzone";
import DocumentList from "@/components/documents/DocumentList";
import type { DocType } from "@/types";

const TYPE_FILTERS: { label: string; value: DocType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Word", value: "docx" },
  { label: "Excel", value: "xlsx" },
];

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const docs = useAppSelector((s) => s.documents);
  const tasks = useAppSelector(selectFilteredTasks);
  const users = useAppSelector((s) => s.users);
  const [filter, setFilter] = useState<DocType | "all">("all");
  const [exporting, setExporting] = useState<string | null>(null);

  const filtered =
    filter === "all" ? docs : docs.filter((d) => d.type === filter);

  const runExport = async (type: "xlsx" | "docx" | "pdf") => {
    if (!tasks.length) {
      dispatch(addToast({ message: "No tasks to export", variant: "warning" }));
      return;
    }
    setExporting(type);
    try {
      const name = `taskflow-${new Date().toISOString().slice(0, 10)}`;
      if (type === "xlsx") exportTasksToExcel(tasks, users, name);
      if (type === "pdf") exportTasksToPDF(tasks, users, name);
      if (type === "docx") await exportTasksToWord(tasks, users, name);
      dispatch(
        addToast({
          message: `Exported as ${type.toUpperCase()}`,
          variant: "success",
        }),
      );
    } catch {
      dispatch(addToast({ message: "Export failed", variant: "error" }));
    } finally {
      setExporting(null);
    }
  };

  const EXPORTS = [
    {
      type: "xlsx" as const,
      label: "Excel",
      icon: "📊",
      color: "var(--success)",
    },
    { type: "docx" as const, label: "Word", icon: "📝", color: "var(--info)" },
    { type: "pdf" as const, label: "PDF", icon: "📄", color: "var(--danger)" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl space-y-6">
      <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <h1
          className="font-display font-bold text-2xl"
          style={{ color: "var(--text)" }}
        >
          Documents
        </h1>
        <p
          className="text-xs font-mono mt-0.5"
          style={{ color: "var(--text3)" }}
        >
          Upload, manage, and export files
        </p>
      </div>

      <div
        className="border p-5"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="text-xs font-mono uppercase tracking-widest mb-1"
          style={{ color: "var(--text3)" }}
        >
          Export Task Report
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text2)" }}>
          Download all current tasks ({tasks.length}) as a formatted document
        </p>
        <div className="flex flex-wrap gap-2">
          {EXPORTS.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => runExport(type)}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2.5 border text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{ borderColor: color, color }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  color + "15")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              {exporting === type ? (
                <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{icon}</span>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="border p-5"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="text-xs font-mono uppercase tracking-widest mb-1"
          style={{ color: "var(--text3)" }}
        >
          Upload Files
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text2)" }}>
          PDF, Word, Excel — max 10MB each
        </p>
        <DocumentDropzone />
      </div>

      <div
        className="border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "var(--text3)" }}
            >
              Library
            </span>
            <span
              className="ml-2 text-xs font-mono"
              style={{ color: "var(--text3)" }}
            >
              ({docs.length})
            </span>
          </div>
          <div className="flex gap-1">
            {TYPE_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="px-3 py-1 text-xs font-mono border transition-all"
                style={{
                  borderColor:
                    filter === value ? "var(--accent)" : "var(--border)",
                  color: filter === value ? "var(--accent)" : "var(--text3)",
                  background:
                    filter === value ? "var(--accent-bg)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          <DocumentList docs={filtered} showTask />
        </div>
      </div>
    </div>
  );
}
