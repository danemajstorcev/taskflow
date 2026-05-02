import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FiltersState, Status, Priority } from "@/types";

const initialState: FiltersState = {
  search: "",
  status: "",
  priority: "",
  assignedTo: "",
  sortBy: "newest",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setStatus(state, action: PayloadAction<Status | "">) {
      state.status = action.payload;
    },
    setPriority(state, action: PayloadAction<Priority | "">) {
      state.priority = action.payload;
    },
    setAssignedTo(state, action: PayloadAction<string>) {
      state.assignedTo = action.payload;
    },
    setSortBy(state, action: PayloadAction<FiltersState["sortBy"]>) {
      state.sortBy = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setStatus,
  setPriority,
  setAssignedTo,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
