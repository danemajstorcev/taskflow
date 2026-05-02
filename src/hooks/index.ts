import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import type { RootState, AppDispatch } from "@/store";
import type { Task } from "@/types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(fn: (s: RootState) => T) => useSelector(fn);

const selectAllTasks = (s: RootState) => s.tasks;
const selectFilters = (s: RootState) => s.filters;

const PRIORITY_WEIGHT: Record<string, number> = { high: 3, medium: 2, low: 1 };

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (tasks, filters): Task[] => {
    let result = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    if (filters.status)
      result = result.filter((t) => t.status === filters.status);
    if (filters.priority)
      result = result.filter((t) => t.priority === filters.priority);
    if (filters.assignedTo)
      result = result.filter((t) => t.assignedTo === filters.assignedTo);

    switch (filters.sortBy) {
      case "oldest":
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "priority":
        result.sort(
          (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority],
        );
        break;
      case "dueDate":
        result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        break;
    }

    return result;
  },
);

export const selectTasksByStatus = createSelector(
  [selectFilteredTasks],
  (tasks) => ({
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  }),
);

export const selectDashboardStats = createSelector(
  [selectAllTasks],
  (tasks) => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    high: tasks.filter((t) => t.priority === "high").length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate < new Date().toISOString().slice(0, 10) &&
        t.status !== "done",
    ).length,
  }),
);
