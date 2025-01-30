import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../api/authApi';
import { adminApi } from '../api/adminApi';
import type { RootState } from '../store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage
const loadState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadState();

interface AuthPayload {
  user: User;
  token: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('auth', JSON.stringify(state));
        }
      )
      .addMatcher(
        adminApi.endpoints.adminLogin.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('auth', JSON.stringify(state));
        }
      );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer; 