import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectFilteredTasks } from '@/hooks';
import { addToast } from '@/store/slices/uiSlice';
import { exportTasksToExcel, exportTasksToWord, exportTasksToPDF } from '@/utils/docUtils';

export default function ExportToolbar() {
  const dispatch  = useAppDispatch();
  const tasks     = useAppSelector(selectFilteredTasks);
  const users     = useAppSelector((s) => s.users);
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (type: 'xlsx' | 'docx' | 'pdf') => {
    if (!tasks.length) { dispatch(addToast({ message: 'No tasks to export', variant: 'warning' })); return; }
    setLoading(type);
    try {
      const name = `taskflow-${new Date().toISOString().slice(0, 10)}`;
      if (type === 'xlsx') exportTasksToExcel(tasks, users, name);
      if (type === 'pdf')  exportTasksToPDF(tasks, users, name);
      if (type === 'docx') await exportTasksToWord(tasks, users, name);
      dispatch(addToast({ message: `Exported as ${type.toUpperCase()}`, variant: 'success' }));
    } catch {
      dispatch(addToast({ message: 'Export failed', variant: 'error' }));
    } finally {
      setLoading(null); }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:block" style={{ color: 'var(--text3)' }}>Export:</span>
      {([
        { type: 'xlsx' as const, label: 'XLS', color: 'var(--success)' },
        { type: 'docx' as const, label: 'DOC', color: 'var(--info)'    },
        { type: 'pdf'  as const, label: 'PDF', color: 'var(--danger)'  },
      ]).map(({ type, label, color }) => (
        <button key={type} onClick={() => run(type)} disabled={loading !== null}
          className="flex items-center gap-1 px-2.5 py-1.5 border text-[11px] font-mono font-bold transition-all disabled:opacity-50"
          style={{ borderColor: color + '50', color }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = color + '10')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          {loading === type
            ? <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
            : null
          }
          {label}
        </button>
      ))}
    </div>
  );
}
