import { useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectFilteredTasks } from '@/hooks';
import { addToast } from '@/store/slices/uiSlice';
import { exportTasksToExcel, exportTasksToWord, exportTasksToPDF } from '@/utils/docUtils';

export default function ExportToolbar() {
  const dispatch = useAppDispatch();
  const tasks    = useAppSelector(selectFilteredTasks);
  const users    = useAppSelector((s) => s.users);
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (type: 'xlsx' | 'docx' | 'pdf') => {
    if (!tasks.length) {
      dispatch(addToast({ message: 'No tasks to export', variant: 'warning' }));
      return;
    }
    setLoading(type);
    try {
      const name = `taskflow-export-${new Date().toISOString().slice(0, 10)}`;
      if (type === 'xlsx') exportTasksToExcel(tasks, users, name);
      if (type === 'pdf')  exportTasksToPDF(tasks, users, name);
      if (type === 'docx') await exportTasksToWord(tasks, users, name);
      dispatch(addToast({ message: `Exported as ${type.toUpperCase()}`, variant: 'success' }));
    } catch (err) {
      dispatch(addToast({ message: `Export failed: ${(err as Error).message}`, variant: 'error' }));
    } finally {
      setLoading(null);
    }
  };

  const btns = [
    { type: 'xlsx' as const, label: 'Excel',  color: 'text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40', icon: '📊' },
    { type: 'docx' as const, label: 'Word',   color: 'text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40',       icon: '📝' },
    { type: 'pdf'  as const, label: 'PDF',    color: 'text-red-400 hover:bg-red-500/10 hover:border-red-500/40',           icon: '📄' },
  ];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-slate-500 mr-1 hidden sm:block">Export:</span>
      {btns.map(({ type, label, color, icon }) => (
        <button
          key={type}
          onClick={() => run(type)}
          disabled={loading !== null}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50',
            color
          )}
        >
          {loading === type ? (
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{icon}</span>
          )}
          {label}
        </button>
      ))}
    </div>
  );
}
