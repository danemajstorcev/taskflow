import { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { uploadDocument } from '@/store/slices/documentsSlice';
import { addToast } from '@/store/slices/uiSlice';
import { readFileAsDataUrl, getDocType, formatBytes, DOC_ICONS, DOC_COLORS } from '@/utils/helpers';

const ACCEPTED = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
const MAX_SIZE = 10 * 1024 * 1024;

interface Props {
  taskId?:   string;
  compact?:  boolean;
  onUploaded?: (docId: string) => void;
}

export default function DocumentDropzone({ taskId, compact, onUploaded }: Props) {
  const dispatch   = useAppDispatch();
  const user       = useAppSelector((s) => s.auth.user);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef   = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.size > MAX_SIZE) {
      dispatch(addToast({ message: `${file.name} is too large (max 10MB)`, variant: 'error' }));
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ACCEPTED.some((a) => a.slice(1) === ext)) {
      dispatch(addToast({ message: `${file.name}: unsupported type. Use PDF, Word, or Excel.`, variant: 'error' }));
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const action  = dispatch(uploadDocument({
        name:       file.name,
        type:       getDocType(file.name),
        size:       file.size,
        taskId:     taskId ?? null,
        uploadedBy: user?.id ?? '',
        dataUrl,
      }));

      dispatch(addToast({ message: `${file.name} uploaded`, variant: 'success' }));
      if (onUploaded) onUploaded((action.payload as any).id);
    } catch {
      dispatch(addToast({ message: `Failed to upload ${file.name}`, variant: 'error' }));
    } finally {
      setUploading(false);
    }
  }, [dispatch, taskId, user, onUploaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(processFile);
  }, [processFile]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(processFile);
    e.target.value = '';
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
      >
        <span>⬆</span> Upload file
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} multiple onChange={onFileInput} className="hidden" />
      </button>
    );
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
          dragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          onChange={onFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Uploading…</p>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">{dragging ? '📂' : '⬆'}</div>
            <p className="text-sm font-medium text-white mb-1">
              {dragging ? 'Drop to upload' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-slate-500">or click to browse</p>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              {[
                { label: 'PDF',  color: 'text-red-400'   },
                { label: 'Word', color: 'text-blue-400'  },
                { label: 'Excel',color: 'text-green-400' },
              ].map(({ label, color }) => (
                <span key={label} className={clsx('text-xs font-semibold px-2 py-0.5 rounded bg-slate-800', color)}>
                  {label}
                </span>
              ))}
              <span className="text-xs text-slate-600">· max 10MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
