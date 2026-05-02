import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { login } from "@/store/slices/authSlice";
import type { User } from "@/types";

const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "u1",
    name: "Dana Kovač",
    email: "dana@taskflow.io",
    password: "admin123",
    role: "admin",
    avatar: "DK",
    team: "Management",
    createdAt: "2024-01-10",
  },
  {
    id: "u2",
    name: "Lena Horváth",
    email: "lena@taskflow.io",
    password: "manager123",
    role: "manager",
    avatar: "LH",
    team: "Product",
    createdAt: "2024-02-14",
  },
  {
    id: "u3",
    name: "Marco Rossi",
    email: "marco@taskflow.io",
    password: "user123",
    role: "user",
    avatar: "MR",
    team: "Engineering",
    createdAt: "2024-03-01",
  },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuth) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) {
      setError("Invalid credentials");
      return;
    }
    const { password: _, ...user } = found;
    dispatch(login(user));
    navigate("/dashboard");
  };

  const quickLogin = (u: (typeof DEMO_USERS)[0]) => {
    const { password: _, ...user } = u;
    dispatch(login(user));
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col sm:flex-row"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="sm:w-1/2 flex flex-col justify-between p-8 sm:p-12 border-b sm:border-b-0 sm:border-r"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div>
          <div className="flex items-center gap-2.5 mb-12 sm:mb-20">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <span className="font-display font-bold text-white text-sm">
                TF
              </span>
            </div>
            <span
              className="font-display font-bold text-xl"
              style={{ color: "var(--text)" }}
            >
              TaskFlow
            </span>
          </div>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            Enterprise Workflow
            <br />
            Management
          </h1>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "var(--text2)" }}
          >
            Redux-driven task management with role-based access, Kanban boards,
            document exports, and real-time state.
          </p>
        </div>

        <div
          className="mt-8 p-4 border font-mono text-xs"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <div className="font-bold mb-2" style={{ color: "var(--accent)" }}>
            Redux Store — 6 Slices
          </div>
          {[
            "authSlice → session + RBAC",
            "tasksSlice → full task lifecycle",
            "usersSlice → team management",
            "filtersSlice → memoized search",
            "uiSlice → modals + toasts + theme",
            "documentsSlice → file management",
          ].map((s) => (
            <div key={s} className="py-0.5" style={{ color: "var(--text2)" }}>
              · {s}
            </div>
          ))}
        </div>
      </div>

      <div className="sm:w-1/2 flex flex-col justify-center p-8 sm:p-12">
        <h2
          className="font-display font-bold text-2xl mb-1"
          style={{ color: "var(--text)" }}
        >
          Sign in
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--text3)" }}>
          Use a demo account or enter credentials
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-3 py-2.5 text-sm border focus:outline-none font-mono"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-3 py-2.5 text-sm border focus:outline-none font-mono"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          {error && (
            <p
              className="text-xs font-mono px-3 py-2 border"
              style={{
                color: "var(--danger)",
                borderColor: "var(--danger)",
                background: "var(--danger-bg)",
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-bold font-mono text-white hover:opacity-80 transition-opacity"
            style={{ background: "var(--accent)" }}
          >
            Sign In →
          </button>
        </form>

        <div className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--text3)" }}
          >
            Quick Demo Access
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => quickLogin(u)}
                className="w-full flex items-center gap-3 p-3 border text-left transition-all group"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  {u.avatar}
                </div>
                <div className="flex-1">
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {u.name}
                  </div>
                  <div
                    className="text-[11px] font-mono"
                    style={{ color: "var(--text3)" }}
                  >
                    {u.email} · <span className="capitalize">{u.role}</span>
                  </div>
                </div>
                <span
                  className="text-xs font-mono group-hover:translate-x-0.5 transition-transform"
                  style={{ color: "var(--accent)" }}
                >
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
