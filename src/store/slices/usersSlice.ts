import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Role } from '@/types';
import { uid, today } from '@/utils/helpers';

const SEED_USERS: User[] = [
  { id: 'u1', name: 'Dana Kovač',    email: 'dana@taskflow.io',   role: 'admin',   avatar: 'DK', team: 'Management',  createdAt: '2024-01-10' },
  { id: 'u2', name: 'Lena Horváth',  email: 'lena@taskflow.io',   role: 'manager', avatar: 'LH', team: 'Product',     createdAt: '2024-02-14' },
  { id: 'u3', name: 'Marco Rossi',   email: 'marco@taskflow.io',  role: 'user',    avatar: 'MR', team: 'Engineering', createdAt: '2024-03-01' },
  { id: 'u4', name: 'Sara Jovanović',email: 'sara@taskflow.io',   role: 'user',    avatar: 'SJ', team: 'Engineering', createdAt: '2024-03-15' },
  { id: 'u5', name: 'Tom Bauer',     email: 'tom@taskflow.io',    role: 'manager', avatar: 'TB', team: 'Design',      createdAt: '2024-04-01' },
];

const load = (): User[] => {
  try { const r = localStorage.getItem('tf_users'); return r ? JSON.parse(r) : SEED_USERS; }
  catch { return SEED_USERS; }
};
const save = (u: User[]) => localStorage.setItem('tf_users', JSON.stringify(u));

const usersSlice = createSlice({
  name: 'users',
  initialState: load(),
  reducers: {
    addUser(state, action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) {
      state.push({ ...action.payload, id: uid(), createdAt: today() });
      save(state);
    },
    updateUser(state, action: PayloadAction<Partial<User> & { id: string }>) {
      const idx = state.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) { state[idx] = { ...state[idx], ...action.payload }; save(state); }
    },
    removeUser(state, action: PayloadAction<string>) {
      const next = state.filter((u) => u.id !== action.payload);
      save(next); return next;
    },
    changeRole(state, action: PayloadAction<{ id: string; role: Role }>) {
      const user = state.find((u) => u.id === action.payload.id);
      if (user) { user.role = action.payload.role; save(state); }
    },
  },
});

export const { addUser, updateUser, removeUser, changeRole } = usersSlice.actions;
export default usersSlice.reducer;
