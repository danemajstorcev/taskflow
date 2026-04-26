import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { setSearch } from '@/store/slices/filtersSlice';

interface Props { title: string }

export default function TopBar({ title }: Props) {
  const dispatch = useAppDispatch();
  const search   = useAppSelector((s) => s.filters.search);
  const open     = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <header className="h-14 flex items-center gap-4 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-30">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="md:hidden text-slate-400 hover:text-white transition-colors"
      >
        ☰
      </button>

      <h1 className="font-display font-semibold text-white text-base sm:text-lg flex-shrink-0">
        {title}
      </h1>

      <div className="flex-1" />

      <div className="relative hidden sm:block w-52 lg:w-72">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg text-sm text-white pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
        />
      </div>
    </header>
  );
}
