import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoading: false,
  globalError: null,
  autoRefresh: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
    setGlobalError(state, action) {
      state.globalError = action.payload;
    },
    toggleAutoRefresh(state) {
      state.autoRefresh = !state.autoRefresh;
    }
  }
});

export const { setGlobalLoading, setGlobalError, toggleAutoRefresh } = uiSlice.actions;
export default uiSlice.reducer; 