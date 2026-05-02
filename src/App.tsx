import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { closeModal } from "@/store/slices/uiSlice";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ToastContainer from "@/components/ui/ToastContainer";
import Modal from "@/components/ui/Modal";
import TaskForm from "@/components/tasks/TaskForm";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import TaskDetailPage from "@/pages/TaskDetailPage";
import UsersPage from "@/pages/UsersPage";
import DocumentsPage from "@/pages/DocumentsPage";
import SettingsPage from "@/pages/SettingsPage";
import type { Task } from "@/types";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();
  if (!isAuth)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AppModals() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  const modalPayload = useAppSelector((s) => s.ui.modalPayload);
  const close = () => dispatch(closeModal());
  return (
    <>
      <Modal
        open={activeModal === "createTask"}
        onClose={close}
        title="New Task"
      >
        <TaskForm onClose={close} />
      </Modal>
      <Modal
        open={activeModal === "editTask"}
        onClose={close}
        title="Edit Task"
      >
        <TaskForm task={modalPayload as Task} onClose={close} />
      </Modal>
    </>
  );
}

const NAV_ITEMS = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/tasks", icon: "✓", label: "Tasks" },
  { to: "/users", icon: "◎", label: "Users" },
  { to: "/documents", icon: "📁", label: "Docs" },
  { to: "/settings", icon: "⚙", label: "Settings" },
];

function BottomNav() {
  const user = useAppSelector((s) => s.auth.user);
  const items =
    user?.role === "user"
      ? NAV_ITEMS.filter((n) => n.to !== "/users")
      : NAV_ITEMS;
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex border-t bg-surface"
      style={{ borderColor: "var(--border)" }}
    >
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors
            ${isActive ? "text-accent" : "text-sub"}`
          }
        >
          <span className="text-base leading-none">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <div className="hidden md:block flex-shrink-0">
        <Sidebar navItems={NAV_ITEMS} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-surface border-r border-base flex flex-col">
            <Sidebar
              navItems={NAV_ITEMS}
              onNavClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      <BottomNav />
      <AppModals />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AppLayout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </AppLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
