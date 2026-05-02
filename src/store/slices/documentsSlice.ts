import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Document } from "@/types";
import { uid } from "@/utils/helpers";

const load = (): Document[] => {
  try {
    const r = localStorage.getItem("tf_docs");
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
};
const save = (d: Document[]) =>
  localStorage.setItem("tf_docs", JSON.stringify(d));

const documentsSlice = createSlice({
  name: "documents",
  initialState: load(),
  reducers: {
    uploadDocument(
      state,
      action: PayloadAction<Omit<Document, "id" | "uploadedAt">>,
    ) {
      state.push({
        ...action.payload,
        id: uid(),
        uploadedAt: new Date().toISOString(),
      });
      save(state);
    },
    deleteDocument(state, action: PayloadAction<string>) {
      const next = state.filter((d) => d.id !== action.payload);
      save(next);
      return next;
    },
    linkToTask(
      state,
      action: PayloadAction<{ docId: string; taskId: string }>,
    ) {
      const doc = state.find((d) => d.id === action.payload.docId);
      if (doc) {
        doc.taskId = action.payload.taskId;
        save(state);
      }
    },
    unlinkFromTask(state, action: PayloadAction<string>) {
      const doc = state.find((d) => d.id === action.payload);
      if (doc) {
        doc.taskId = null;
        save(state);
      }
    },
  },
});

export const { uploadDocument, deleteDocument, linkToTask, unlinkFromTask } =
  documentsSlice.actions;
export default documentsSlice.reducer;
