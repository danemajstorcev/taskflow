export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const today = () => new Date().toISOString().slice(0, 10);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const isOverdue = (dueDate: string, status: string) =>
  status !== 'done' && dueDate < today();

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getDocType = (filename: string): import('@/types').DocType => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf')  return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  return 'unknown';
};

export const DOC_ICONS: Record<string, string> = {
  pdf:     '📄',
  docx:    '📝',
  xlsx:    '📊',
  unknown: '📎',
};

export const DOC_COLORS: Record<string, string> = {
  pdf:     'text-red-500 bg-red-500/10',
  docx:    'text-blue-500 bg-blue-500/10',
  xlsx:    'text-green-500 bg-green-500/10',
  unknown: 'text-slate-400 bg-slate-400/10',
};

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target?.result as string ?? '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
