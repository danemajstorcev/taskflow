import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Toast } from "@/types";
import { uid } from "@/utils/helpers";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  activeModal: string | null;
  modalPayload: unknown;
  toasts: Toast[];
  globalLoading: boolean;
}

const savedTheme =
  (localStorage.getItem("tf_theme") as "light" | "dark") || "dark";

const initialState: UIState = {
  theme: savedTheme,
  sidebarOpen: true,
  activeModal: null,
  modalPayload: null,
  toasts: [],
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("tf_theme", state.theme);
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal(
      state,
      action: PayloadAction<{ modal: string; payload?: unknown }>,
    ) {
      state.activeModal = action.payload.modal;
      state.modalPayload = action.payload.payload ?? null;
    },
    closeModal(state) {
      state.activeModal = null;
      state.modalPayload = null;
    },
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      state.toasts.push({ ...action.payload, id: uid() });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  openModal,
  closeModal,
  addToast,
  removeToast,
  setLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
