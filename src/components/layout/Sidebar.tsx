import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";

interface NavItem {
  to: string;
  icon: string;
  label: string;
}
interface Props {
  navItems: NavItem[];
  onNavClick?: () => void;
}

export default function Sidebar({ navItems, onNavClick }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const visible =
    user?.role === "user"
      ? navItems.filter((n) => n.to !== "/users")
      : navItems;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-56 h-full flex flex-col bg-surface border-r border-base">
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-base">
        <div className="w-7 h-7 bg-accent flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-white text-xs">TF</span>
        </div>
        <span
          className="font-display font-bold text-base text-base"
          style={{ color: "var(--text)" }}
        >
          TaskFlow
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visible.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-accent-bg text-accent border-l-2 border-accent pl-[10px]"
                  : "text-sub hover:text-base hover:bg-base2"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    backgroundColor: "var(--accent-bg)",
                    color: "var(--accent)",
                    borderLeftColor: "var(--accent)",
                  }
                : {}
            }
          >
            <span className="w-4 text-center text-base leading-none">
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        className="mx-3 mb-3 p-2.5 border border-base bg-base2 text-xs font-mono"
        style={{ color: "var(--text3)" }}
      >
        <div className="font-bold mb-1" style={{ color: "var(--accent)" }}>
          Redux Store
        </div>
        <ReduxStatus />
      </div>

      <div className="px-3 pb-4 space-y-0.5 border-t border-base pt-3">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-sub hover:text-base hover:bg-base2 transition-all"
        >
          <span className="w-4 text-center">
            {theme === "dark" ? "☀" : "◐"}
          </span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "var(--accent)" }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-base truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-muted capitalize">
                {user.role}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-all"
          style={{ color: "var(--text3)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text3)";
          }}
        >
          <span className="w-4 text-center">↩</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

function ReduxStatus() {
  const tasks = useAppSelector((s) => s.tasks.length);
  const users = useAppSelector((s) => s.users.length);
  const docs = useAppSelector((s) => s.documents.length);
  const filters = useAppSelector((s) => s.filters);
  const modal = useAppSelector((s) => s.ui.activeModal);
  const activeFilters = [
    filters.search,
    filters.status,
    filters.priority,
    filters.assignedTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-0.5" style={{ color: "var(--text3)" }}>
      <div>
        tasks: <span style={{ color: "var(--text2)" }}>{tasks}</span>
      </div>
      <div>
        users: <span style={{ color: "var(--text2)" }}>{users}</span>
      </div>
      <div>
        docs: <span style={{ color: "var(--text2)" }}>{docs}</span>
      </div>
      <div>
        filters:{" "}
        <span
          style={{
            color: activeFilters > 0 ? "var(--accent)" : "var(--text2)",
          }}
        >
          {activeFilters} active
        </span>
      </div>
      <div>
        modal:{" "}
        <span style={{ color: modal ? "var(--accent)" : "var(--text2)" }}>
          {modal ?? "none"}
        </span>
      </div>
    </div>
  );
}
