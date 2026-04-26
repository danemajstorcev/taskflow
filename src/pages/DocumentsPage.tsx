import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectFilteredTasks } from '@/hooks';
import { addToast } from '@/store/slices/uiSlice';
import { exportTasksToExcel, exportTasksToWord, exportTasksToPDF } from '@/utils/docUtils';
import TopBar from '@/components/layout/TopBar';
import DocumentDropzone from '@/components/documents/DocumentDropzone';
import DocumentList from '@/components/documents/DocumentList';
import type { DocType } from '@/types';

const TYPE_FILTERS: { label: string; value: DocType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Word', value: 'docx' },
  { label: 'Excel', value: 'xlsx' },
];

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const docs     = useAppSelector((s) => s.documents);
  const tasks    = useAppSelector(selectFilteredTasks);
  const users    = useAppSelector((s) => s.users);

  const [filter,   setFilter]   = useState<DocType | 'all'>('all');
  const [exporting, setExporting] = useState<string | null>(null);

  const filtered = filter === 'all' ? docs : docs.filter((d) => d.type === filter);

  const runExport = async (type: 'xlsx' | 'docx' | 'pdf') => {
    if (!tasks.length) { dispatch(addToast({ message: 'No tasks to export', variant: 'warning' })); return; }
    setExporting(type);
    try {
      const name = `taskflow-${new Date().toISOString().slice(0, 10)}`;
      if (type === 'xlsx') exportTasksToExcel(tasks, users, name);
      if (type === 'pdf')  exportTasksToPDF(tasks, users, name);
      if (type === 'docx') await exportTasksToWord(tasks, users, name);
      dispatch(addToast({ message: `Tasks exported as ${type.toUpperCase()}`, variant: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: `Export failed`, variant: 'error' }));
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Documents" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        {/* Export tasks section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="font-display font-semibold text-white text-sm mb-1">Export Task Report</h2>
          <p className="text-xs text-slate-500 mb-4">Download all current tasks (with active filters) as a formatted document.</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { type: 'xlsx' as const, label: 'Excel Spreadsheet', icon: '📊', color: 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10' },
              { type: 'docx' as const, label: 'Word Document',     icon: '📝', color: 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10' },
              { type: 'pdf'  as const, label: 'PDF Report',        icon: '📄', color: 'text-red-400 border-red-500/30 hover:bg-red-500/10' },
            ].map(({ type, label, icon, color }) => (
              <button key={type} onClick={() => runExport(type)} disabled={exporting !== null}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${color}`}>
                {exporting === type
                  ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                  : <span className="text-base">{icon}</span>
                }
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="font-display font-semibold text-white text-sm mb-1">Upload Documents</h2>
          <p className="text-xs text-slate-500 mb-4">Upload PDF, Word, or Excel files. You can link them to tasks later.</p>
          <DocumentDropzone />
        </div>

        {/* Document library */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="font-display font-semibold text-white text-sm">Document Library</h2>
              <p className="text-xs text-slate-500 mt-0.5">{docs.length} file{docs.length !== 1 ? 's' : ''} uploaded</p>
            </div>
            <div className="flex gap-1.5">
              {TYPE_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => setFilter(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === value
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <DocumentList docs={filtered} showTask />
        </div>

      </div>
    </div>
  );
}
