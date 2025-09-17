import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeRange: '7d',
  region: 'all',
  category: 'all',
  customer: 'all',
  lastUpdatedAt: null
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateFilters(state, action) {
      const next = action.payload || {};
      state.timeRange = next.timeRange ?? state.timeRange;
      state.region = next.region ?? state.region;
      state.category = next.category ?? state.category;
      state.customer = next.customer ?? state.customer;
      state.lastUpdatedAt = Date.now();
    }
  }
});

export const { updateFilters } = filtersSlice.actions;
export default filtersSlice.reducer; 