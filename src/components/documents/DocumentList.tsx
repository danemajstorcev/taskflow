import { useAppDispatch, useAppSelector } from "@/hooks";
import { deleteDocument } from "@/store/slices/documentsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { formatBytes, formatDate, DOC_ICONS } from "@/utils/helpers";
import { downloadDocumentFile } from "@/utils/docUtils";
import type { Document } from "@/types";

const DOC_COLOR_VARS: Record<string, string> = {
  pdf: "var(--danger)",
  docx: "var(--info)",
  xlsx: "var(--success)",
  unknown: "var(--text3)",
};

interface Props {
  docs: Document[];
  showTask?: boolean;
  onDetach?: (docId: string) => void;
}

export default function DocumentList({ docs, showTask, onDetach }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const tasks = useAppSelector((s) => s.tasks);

  if (!docs.length) {
    return (
      <div
        className="py-10 text-center text-sm font-mono"
        style={{ color: "var(--text3)" }}
      >
        No documents yet
      </div>
    );
  }

  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {docs.map((doc) => {
        const task = tasks.find((t) => t.id === doc.taskId);
        const canDelete = user?.role === "admin" || doc.uploadedBy === user?.id;
        const color = DOC_COLOR_VARS[doc.type] ?? "var(--text3)";

        return (
          <div
            key={doc.id}
            className="flex items-center gap-3 py-3 group"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center text-base flex-shrink-0 font-mono font-bold border"
              style={{
                borderColor: color + "40",
                color,
                background: color + "10",
              }}
            >
              {DOC_ICONS[doc.type]}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text)" }}
              >
                {doc.name}
              </p>
              <div
                className="flex items-center gap-2 mt-0.5 text-[11px] font-mono flex-wrap"
                style={{ color: "var(--text3)" }}
              >
                <span className="uppercase font-bold" style={{ color }}>
                  {doc.type}
                </span>
                <span>·</span>
                <span>{formatBytes(doc.size)}</span>
                <span>·</span>
                <span>{formatDate(doc.uploadedAt)}</span>
                {showTask && task && (
                  <>
                    <span>·</span>
                    <span
                      className="truncate max-w-[140px]"
                      style={{ color: "var(--accent)" }}
                    >
                      {task.title}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  downloadDocumentFile(doc);
                  dispatch(
                    addToast({
                      message: `Downloading ${doc.name}`,
                      variant: "info",
                    }),
                  );
                }}
                className="px-2 py-1.5 text-xs font-mono transition-colors"
                style={{ color: "var(--text3)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "var(--text3)")
                }
              >
                ⬇
              </button>
              {onDetach && (
                <button
                  onClick={() => onDetach(doc.id)}
                  className="px-2 py-1.5 text-xs font-mono transition-colors"
                  style={{ color: "var(--text3)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--text3)")
                  }
                >
                  ✕
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => {
                    if (!confirm(`Delete "${doc.name}"?`)) return;
                    dispatch(deleteDocument(doc.id));
                    dispatch(
                      addToast({
                        message: `${doc.name} deleted`,
                        variant: "success",
                      }),
                    );
                  }}
                  className="px-2 py-1.5 text-xs font-mono transition-colors"
                  style={{ color: "var(--text3)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--danger)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--text3)")
                  }
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
