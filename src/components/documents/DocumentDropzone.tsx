import { useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { uploadDocument } from "@/store/slices/documentsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { readFileAsDataUrl, getDocType, formatBytes } from "@/utils/helpers";

const ACCEPTED = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
const MAX_SIZE = 10 * 1024 * 1024;

interface Props {
  taskId?: string;
  onUploaded?: (docId: string) => void;
}

export default function DocumentDropzone({ taskId, onUploaded }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_SIZE) {
        dispatch(
          addToast({
            message: `${file.name} is too large (max 10MB)`,
            variant: "error",
          }),
        );
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ACCEPTED.some((a) => a.slice(1) === ext)) {
        dispatch(
          addToast({
            message: `${file.name}: only PDF, Word, or Excel accepted`,
            variant: "error",
          }),
        );
        return;
      }
      setUploading(true);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const result = dispatch(
          uploadDocument({
            name: file.name,
            type: getDocType(file.name),
            size: file.size,
            taskId: taskId ?? null,
            uploadedBy: user?.id ?? "",
            dataUrl,
          }),
        );
        dispatch(
          addToast({ message: `${file.name} uploaded`, variant: "success" }),
        );
        if (onUploaded) onUploaded((result.payload as any).id);
      } catch {
        dispatch(
          addToast({
            message: `Failed to upload ${file.name}`,
            variant: "error",
          }),
        );
      } finally {
        setUploading(false);
      }
    },
    [dispatch, taskId, user, onUploaded],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      Array.from(e.dataTransfer.files).forEach(processFile);
    },
    [processFile],
  );

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onClick={() => !uploading && inputRef.current?.click()}
      className="border-2 border-dashed p-8 text-center cursor-pointer transition-all"
      style={{
        borderColor: dragging ? "var(--accent)" : "var(--border2)",
        background: dragging ? "var(--accent-bg)" : "var(--bg)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        onChange={(e) => {
          Array.from(e.target.files ?? []).forEach(processFile);
          e.target.value = "";
        }}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--accent)" }}
          />
          <p className="text-sm font-mono" style={{ color: "var(--text2)" }}>
            Uploading…
          </p>
        </div>
      ) : (
        <>
          <div className="text-3xl mb-2">{dragging ? "📂" : "⬆"}</div>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text)" }}
          >
            {dragging ? "Drop to upload" : "Drag & drop files here"}
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--text3)" }}>
            or click to browse · PDF, Word, Excel · max 10MB
          </p>
          <div className="flex justify-center gap-2 mt-3">
            {["PDF", "DOCX", "XLSX"].map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono font-bold px-2 py-0.5 border"
                style={{ borderColor: "var(--border)", color: "var(--text3)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
