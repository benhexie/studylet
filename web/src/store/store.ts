import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { assessmentApi } from './api/assessmentApi';
import { dashboardApi } from './api/dashboardApi';
import { statisticsApi } from './api/statisticsApi';
import { adminApi } from './api/adminApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [assessmentApi.reducerPath]: assessmentApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      assessmentApi.middleware,
      dashboardApi.middleware,
      statisticsApi.middleware,
      adminApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 