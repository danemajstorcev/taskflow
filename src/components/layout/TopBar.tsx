import { useAppDispatch, useAppSelector } from "@/hooks";
import { setSearch } from "@/store/slices/filtersSlice";
import { toggleTheme } from "@/store/slices/uiSlice";

interface Props {
  onMenuOpen: () => void;
}

export default function TopBar({ onMenuOpen }: Props) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((s) => s.filters.search);
  const theme = useAppSelector((s) => s.ui.theme);

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-base bg-surface flex-shrink-0">
      <button
        onClick={onMenuOpen}
        className="md:hidden text-sub hover:text-base transition-colors p-1"
        aria-label="Menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="md:hidden flex items-center gap-2">
        <div
          className="w-6 h-6 flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <span className="font-display font-bold text-white text-[10px]">
            TF
          </span>
        </div>
        <span className="font-display font-bold text-sm text-base">
          TaskFlow
        </span>
      </div>

      <div className="hidden sm:flex flex-1 max-w-sm relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-8 pr-3 py-1.5 text-sm bg-base border border-base focus:outline-none focus:border-base2 transition-colors font-mono placeholder:text-muted text-base"
        />
      </div>

      <div className="flex-1 hidden sm:block" />

      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 text-sub hover:text-base transition-colors text-sm"
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        {theme === "dark" ? "☀" : "◐"}
      </button>
    </header>
  );
}
