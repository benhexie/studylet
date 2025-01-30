import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  timeFilter: 'today' | 'week' | 'month' | 'year';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'light',
  timeFilter: 'month',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setTimeFilter: (state, action: PayloadAction<'today' | 'week' | 'month' | 'year'>) => {
      state.timeFilter = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme, setTimeFilter } = uiSlice.actions;
export const selectUI = (state: RootState) => state.ui;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectTimeFilter = (state: RootState) => state.ui.timeFilter;

export default uiSlice.reducer; 