import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { openModal } from '@/store/slices/uiSlice';
import TopBar from '@/components/layout/TopBar';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import FiltersBar from '@/components/tasks/FiltersBar';
import ExportToolbar from '@/components/documents/ExportToolbar';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((s) => s.auth.user);
  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Tasks" />
      <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 gap-4">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <FiltersBar />
          <div className="flex items-center gap-3 flex-wrap">
            <ExportToolbar />
            {canCreate && (
              <button onClick={() => dispatch(openModal({ modal: 'createTask' }))}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                + New Task
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
