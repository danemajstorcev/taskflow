import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './slices/authSlice';
import tasksReducer     from './slices/tasksSlice';
import usersReducer     from './slices/usersSlice';
import filtersReducer   from './slices/filtersSlice';
import uiReducer        from './slices/uiSlice';
import documentsReducer from './slices/documentsSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    tasks:     tasksReducer,
    users:     usersReducer,
    filters:   filtersReducer,
    ui:        uiReducer,
    documents: documentsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
