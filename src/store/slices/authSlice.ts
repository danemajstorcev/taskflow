import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const saved = localStorage.getItem("tf_auth");

const initialState: AuthState = saved
  ? JSON.parse(saved)
  : { user: null, isAuthenticated: false, token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = `mock-token-${action.payload.id}`;
      localStorage.setItem("tf_auth", JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("tf_auth");
    },
    updateRole(
      state,
      action: PayloadAction<{ userId: string; role: User["role"] }>,
    ) {
      if (state.user?.id === action.payload.userId) {
        state.user.role = action.payload.role;
        localStorage.setItem("tf_auth", JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, updateRole } = authSlice.actions;
export default authSlice.reducer;
