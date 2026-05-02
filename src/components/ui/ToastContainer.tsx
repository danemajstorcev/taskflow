import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { removeToast } from '@/store/slices/uiSlice';

const ICONS   = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const BG: Record<string, string> = {
  success: 'var(--success-bg)', error: 'var(--danger-bg)',
  warning: 'var(--accent-bg)', info: 'var(--info-bg)',
};
const FG: Record<string, string> = {
  success: 'var(--success)', error: 'var(--danger)',
  warning: 'var(--accent)', info: 'var(--info)',
};

function Toast({ id, message, variant }: { id: string; message: string; variant: string }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), 4000);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 shadow-lg text-sm font-medium border toast-enter max-w-xs"
      style={{ background: BG[variant], borderColor: FG[variant] + '40', color: FG[variant] }}>
      <span className="flex-shrink-0 font-bold">{ICONS[variant as keyof typeof ICONS]}</span>
      <span className="flex-1 text-base" style={{ color: 'var(--text)' }}>{message}</span>
      <button onClick={() => dispatch(removeToast(id))} className="opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => <Toast key={t.id} {...t} />)}
    </div>
  );
}
