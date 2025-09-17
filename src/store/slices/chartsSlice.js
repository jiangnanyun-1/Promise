import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  base: null,
  region: null,
  product: null,
  map: null,
  channel: null,
  channelTrend: null,
  kpi: null,
  loading: false,
  error: null
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    fetchChartsData() {},
    fetchChartsDataSuccess(state, action) {
      const { base, region, product, map, channel, channelTrend, kpi } = action.payload;
      state.base = base;
      state.region = region;
      state.product = product;
      state.map = map;
      state.channel = channel;
      state.channelTrend = channelTrend;
      state.kpi = kpi;
      state.loading = false;
      state.error = null;
    },
    fetchChartsDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload || '加载失败';
    },
    setChartsLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { fetchChartsData, fetchChartsDataSuccess, fetchChartsDataFailure, setChartsLoading } = chartsSlice.actions;
export default chartsSlice.reducer; 