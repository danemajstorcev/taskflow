import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, Status } from "@/types";
import { uid, today } from "@/utils/helpers";

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Redesign onboarding flow",
    description:
      "Update the onboarding UX based on Q3 user research findings. Focus on reducing drop-off at step 3.",
    assignedTo: "u2",
    createdBy: "u1",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-04-01",
    dueDate: "2025-04-20",
    tags: ["ux", "frontend"],
    documents: [],
  },
  {
    id: "t2",
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment to staging and production environments.",
    assignedTo: "u3",
    createdBy: "u1",
    status: "todo",
    priority: "high",
    createdAt: "2025-04-03",
    dueDate: "2025-04-25",
    tags: ["devops"],
    documents: [],
  },
  {
    id: "t3",
    title: "Q2 performance review docs",
    description:
      "Prepare performance review documentation for all team members. Include KPI summaries and growth notes.",
    assignedTo: "u2",
    createdBy: "u1",
    status: "done",
    priority: "medium",
    createdAt: "2025-03-20",
    dueDate: "2025-04-05",
    tags: ["hr", "docs"],
    documents: [],
  },
  {
    id: "t4",
    title: "API rate limiting implementation",
    description:
      "Implement rate limiting on all public API endpoints. Use Redis for distributed rate tracking.",
    assignedTo: "u3",
    createdBy: "u2",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-04-05",
    dueDate: "2025-04-18",
    tags: ["backend", "security"],
    documents: [],
  },
  {
    id: "t5",
    title: "Update privacy policy",
    description:
      "Review and update privacy policy to comply with the latest GDPR amendments effective June 2025.",
    assignedTo: "u4",
    createdBy: "u1",
    status: "todo",
    priority: "medium",
    createdAt: "2025-04-06",
    dueDate: "2025-05-01",
    tags: ["legal"],
    documents: [],
  },
  {
    id: "t6",
    title: "Mobile push notifications",
    description:
      "Implement push notification support for iOS and Android using Firebase Cloud Messaging.",
    assignedTo: "u3",
    createdBy: "u2",
    status: "todo",
    priority: "medium",
    createdAt: "2025-04-07",
    dueDate: "2025-05-10",
    tags: ["mobile", "backend"],
    documents: [],
  },
  {
    id: "t7",
    title: "Write unit tests for auth module",
    description:
      "Achieve 90% test coverage for the authentication module including edge cases for token expiry.",
    assignedTo: "u3",
    createdBy: "u2",
    status: "done",
    priority: "low",
    createdAt: "2025-03-28",
    dueDate: "2025-04-10",
    tags: ["testing"],
    documents: [],
  },
  {
    id: "t8",
    title: "Migrate database to PostgreSQL 16",
    description:
      "Plan and execute migration from PostgreSQL 14 to version 16. Include rollback strategy.",
    assignedTo: "u4",
    createdBy: "u1",
    status: "in-progress",
    priority: "high",
    createdAt: "2025-04-08",
    dueDate: "2025-04-22",
    tags: ["database", "devops"],
    documents: [],
  },
];

const load = (): Task[] => {
  try {
    const raw = localStorage.getItem("tf_tasks");
    return raw ? JSON.parse(raw) : SEED_TASKS;
  } catch {
    return SEED_TASKS;
  }
};

const save = (tasks: Task[]) =>
  localStorage.setItem("tf_tasks", JSON.stringify(tasks));

const tasksSlice = createSlice({
  name: "tasks",
  initialState: load(),
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, "id" | "createdAt">>) {
      state.push({ ...action.payload, id: uid(), createdAt: today() });
      save(state);
    },
    updateTask(state, action: PayloadAction<Partial<Task> & { id: string }>) {
      const idx = state.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state[idx] = { ...state[idx], ...action.payload };
        save(state);
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      const next = state.filter((t) => t.id !== action.payload);
      save(next);
      return next;
    },
    moveTask(state, action: PayloadAction<{ id: string; status: Status }>) {
      const task = state.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        save(state);
      }
    },
    attachDocument(
      state,
      action: PayloadAction<{ taskId: string; docId: string }>,
    ) {
      const task = state.find((t) => t.id === action.payload.taskId);
      if (task && !task.documents.includes(action.payload.docId)) {
        task.documents.push(action.payload.docId);
        save(state);
      }
    },
    detachDocument(
      state,
      action: PayloadAction<{ taskId: string; docId: string }>,
    ) {
      const task = state.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.documents = task.documents.filter(
          (d) => d !== action.payload.docId,
        );
        save(state);
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  attachDocument,
  detachDocument,
} = tasksSlice.actions;
export default tasksSlice.reducer;
