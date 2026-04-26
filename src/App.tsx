import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { closeModal } from '@/store/slices/uiSlice';
import Sidebar from '@/components/layout/Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';
import Modal from '@/components/ui/Modal';
import TaskForm from '@/components/tasks/TaskForm';
import LoginPage      from '@/pages/LoginPage';
import DashboardPage  from '@/pages/DashboardPage';
import TasksPage      from '@/pages/TasksPage';
import TaskDetailPage from '@/pages/TaskDetailPage';
import UsersPage      from '@/pages/UsersPage';
import DocumentsPage  from '@/pages/DocumentsPage';
import SettingsPage   from '@/pages/SettingsPage';
import type { Task } from '@/types';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth   = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AppModals() {
  const dispatch     = useAppDispatch();
  const activeModal  = useAppSelector((s) => s.ui.activeModal);
  const modalPayload = useAppSelector((s) => s.ui.modalPayload);
  const close        = () => dispatch(closeModal());

  return (
    <>
      <Modal open={activeModal === 'createTask'} onClose={close} title="New Task">
        <TaskForm onClose={close} />
      </Modal>
      <Modal open={activeModal === 'editTask'} onClose={close} title="Edit Task">
        <TaskForm task={modalPayload as Task} onClose={close} />
      </Modal>
    </>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const theme       = useAppSelector((s) => s.ui.theme);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '224px' : '56px' }}>
        {children}
      </div>
      <AppModals />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />}  />
                <Route path="/tasks"     element={<TasksPage />}      />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/users"     element={<UsersPage />}      />
                <Route path="/documents" element={<DocumentsPage />}  />
                <Route path="/settings"  element={<SettingsPage />}   />
                <Route path="*"          element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}
