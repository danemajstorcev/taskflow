import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";
import { addToast } from "@/store/slices/uiSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const tasks = useAppSelector((s) => s.tasks.length);
  const docs = useAppSelector((s) => s.documents.length);

  const clearData = () => {
    if (!confirm("Reset all app data? This cannot be undone.")) return;
    ["tf_tasks", "tf_users", "tf_docs", "tf_auth"].forEach((k) =>
      localStorage.removeItem(k),
    );
    dispatch(
      addToast({
        message: "Data cleared — refresh to reload defaults",
        variant: "warning",
      }),
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl space-y-6">
      <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <h1
          className="font-display font-bold text-2xl"
          style={{ color: "var(--text)" }}
        >
          Settings
        </h1>
      </div>

      <div>
        <div
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: "var(--text3)" }}
        >
          Account
        </div>
        <div
          className="border divide-y"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {[
            { label: "Name", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Role", value: user?.role },
            { label: "Team", value: user?.team || "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text3)" }}
              >
                {label}
              </span>
              <span
                className="text-sm font-medium capitalize"
                style={{ color: "var(--text)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: "var(--text3)" }}
        >
          Appearance
        </div>
        <div
          className="border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Theme
              </p>
              <p
                className="text-xs font-mono mt-0.5"
                style={{ color: "var(--text3)" }}
              >
                Currently: {theme} mode
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="flex items-center gap-2 px-4 py-2 border text-xs font-mono font-bold transition-all"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              {theme === "dark" ? "☀ Light" : "◐ Dark"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: "var(--text3)" }}
        >
          Redux Store State
        </div>
        <div
          className="border p-4 font-mono text-xs space-y-1.5"
          style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
        >
          <div className="font-bold mb-2" style={{ color: "var(--accent)" }}>
            store.getState()
          </div>
          {[
            { key: "auth.user", value: user?.name },
            { key: "auth.isAuthenticated", value: "true" },
            { key: "tasks.length", value: String(tasks) },
            { key: "documents.length", value: String(docs) },
            { key: "ui.theme", value: theme },
          ].map(({ key, value }) => (
            <div key={key} className="flex gap-2">
              <span style={{ color: "var(--text3)" }}>{key}:</span>
              <span style={{ color: "var(--text2)" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          className="text-xs font-mono uppercase tracking-widest mb-3"
          style={{ color: "var(--danger)" }}
        >
          Danger Zone
        </div>
        <div
          className="border p-4 flex items-center justify-between gap-4"
          style={{
            borderColor: "var(--danger)",
            background: "var(--danger-bg)",
          }}
        >
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--danger)" }}
            >
              Reset All Data
            </p>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: "var(--text3)" }}
            >
              Clears tasks, users, and documents from localStorage
            </p>
          </div>
          <button
            onClick={clearData}
            className="px-4 py-2 border text-xs font-bold font-mono flex-shrink-0 transition-all hover:opacity-70"
            style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
