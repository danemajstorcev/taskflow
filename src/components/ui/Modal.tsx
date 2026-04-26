import { useEffect } from 'react';
import clsx from 'clsx';

interface Props {
  open:     boolean;
  onClose:  () => void;
  title:    string;
  children: React.ReactNode;
  size?:    'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl',
          'animate-[modalIn_0.2s_cubic-bezier(.16,1,.3,1)]',
          SIZES[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-display font-semibold text-white text-base">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>
        <div className="px-5 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
