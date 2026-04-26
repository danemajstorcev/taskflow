import { useEffect } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { removeToast } from '@/store/slices/uiSlice';

const STYLES = {
  success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  error:   'bg-red-500/15 border-red-500/30 text-red-300',
  warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  info:    'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
};

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

function ToastItem({ id, message, variant }: { id: string; message: string; variant: keyof typeof STYLES }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), 4000);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <div className={clsx(
      'flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl max-w-sm',
      'animate-[slideIn_0.2s_ease]',
      STYLES[variant]
    )}>
      <span className="flex-shrink-0 font-bold">{ICONS[variant]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={() => dispatch(removeToast(id))} className="opacity-60 hover:opacity-100 text-base leading-none ml-1">×</button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
