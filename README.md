TaskFlow — Enterprise Task & Workflow Management System


Project Description:

TaskFlow is a full-featured enterprise workflow management system built for teams that need structured task tracking, role-based access control, and document handling in one place. It simulates a real company environment where admins, managers, and team members collaborate across projects with different levels of permission.
The app features a Redux-driven Kanban board for live task tracking with drag-and-drop, a role-based access system across three user tiers, a complete document manager with upload, export to Excel/Word/PDF, and full CRUD task management. Built with a warm editorial aesthetic using CSS custom properties for a reliable dark/light mode designed for long working sessions.


Tech Stack / Built With:

- React 18
- TypeScript
- Vite
- Redux Toolkit (6 slices — auth, tasks, users, filters, ui, documents)
- Reselect (memoized selectors)
- Tailwind CSS + CSS Custom Properties (design token system)
- xlsx (Excel export)
- docx (Word export)
- jsPDF (PDF export)
- React Router v6
- LocalStorage (persistence layer)


Features:

Dashboard with KPI stat cards, completion progress bar, priority breakdown chart, recent tasks table, team overview, and overdue task alerts
Kanban dispatch board with drag-and-drop task movement across Todo / In Progress / Done columns, synced to Redux on every drop
Full Tasks management — search, filter by status, priority, and assigned user, sortable, full CRUD with permission guards
Users management — admin-only view with role assignment (Admin / Manager / User), add and remove team members, open task count per user
Documents page — drag-and-drop file upload, library with type filters (PDF / Word / Excel), per-task document attachments
Export tasks as Excel spreadsheet, Word document with full table and per-task detail sections, or PDF landscape report
Role-Based Access Control — Admin has full system access, Manager can create and assign tasks, User can only view and update their own tasks
Toast notification system — success, error, warning, and info variants with auto-dismiss, driven by Redux uiSlice
Dark and light mode toggle with CSS custom properties — persisted in localStorage
Fully responsive layout — desktop sidebar, tablet collapsible menu, mobile bottom navigation bar
Live Redux Store readout in the sidebar showing task count, active filters, and open modal state in real time
Settings page with store.getState() snapshot, theme toggle, and data reset


Getting Started / Installation:

- Clone the repository:
git clone https://github.com/danemajstorcev/taskflow

- Navigate to the project folder:
cd taskflow

- Install dependencies:
npm install
Run the development server:
npm run dev

- Open in browser:
http://localhost:5173

- Demo Accounts:
The app ships with seed data and three demo accounts out of the box:
NameEmailPasswordRoleDana Kovačdana@taskflow.ioadmin123AdminLena Horváthlena@taskflow.iomanager123ManagerMarco Rossimarco@taskflow.iouser123User
Each role unlocks different parts of the interface. Log in as Admin to access Users management, create and delete any task, and export reports. Log in as User to see the restricted view — only assigned tasks are actionable.

- Redux Architecture:
The state is split across 6 slices:

authSlice — current user session, role, login/logout, persisted to localStorage
tasksSlice — full task lifecycle (create, update, delete, move status, attach/detach documents), seeded with 8 realistic tasks on first load
usersSlice — team list with add, remove, and role change, seeded with 5 users
filtersSlice — global filtering state for search, status, priority, assignee, and sort order, processed through a memoized createSelector
uiSlice — modal open/close with payload, toast queue, dark/light theme, sidebar state
documentsSlice — uploaded files stored as base64 data URLs, linked/unlinked to tasks

Live Demo:

https://taskflow-two-tawny.vercel.app