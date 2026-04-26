import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { deleteDocument } from '@/store/slices/documentsSlice';
import { addToast } from '@/store/slices/uiSlice';
import { formatBytes, formatDate, DOC_ICONS, DOC_COLORS } from '@/utils/helpers';
import { downloadDocumentFile } from '@/utils/docUtils';
import type { Document } from '@/types';

interface Props {
  docs:      Document[];
  showTask?: boolean;
  onDetach?: (docId: string) => void;
}

export default function DocumentList({ docs, showTask, onDetach }: Props) {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const tasks    = useAppSelector((s) => s.tasks);

  const handleDelete = (doc: Document) => {
    if (!confirm(`Delete "${doc.name}"?`)) return;
    dispatch(deleteDocument(doc.id));
    dispatch(addToast({ message: `${doc.name} deleted`, variant: 'success' }));
  };

  const handleDownload = (doc: Document) => {
    downloadDocumentFile(doc);
    dispatch(addToast({ message: `Downloading ${doc.name}`, variant: 'info' }));
  };

  if (!docs.length) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <div className="text-3xl mb-2">📁</div>
        No documents yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {docs.map((doc) => {
        const task      = tasks.find((t) => t.id === doc.taskId);
        const canDelete = user?.role === 'admin' || doc.uploadedBy === user?.id;

        return (
          <div key={doc.id}
            className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl transition-colors group hover:border-slate-600">
            <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0', DOC_COLORS[doc.type])}>
              {DOC_ICONS[doc.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                <span className="uppercase font-semibold">{doc.type}</span>
                <span>·</span>
                <span>{formatBytes(doc.size)}</span>
                <span>·</span>
                <span>{formatDate(doc.uploadedAt)}</span>
                {showTask && task && (
                  <>
                    <span>·</span>
                    <span className="text-indigo-400 truncate max-w-[120px]">{task.title}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => handleDownload(doc)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm" title="Download">
                ⬇
              </button>
              {onDetach && (
                <button onClick={() => onDetach(doc.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs" title="Detach">
                  ✕
                </button>
              )}
              {canDelete && (
                <button onClick={() => handleDelete(doc)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs" title="Delete">
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
