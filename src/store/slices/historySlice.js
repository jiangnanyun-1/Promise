import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  records: [] // [{ timestamp, filters }]
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushHistory(state, action) {
      state.records.push({ timestamp: Date.now(), filters: action.payload });
    },
    popHistory(state) {
      state.records.pop();
    }
  }
});

export const { pushHistory, popHistory } = historySlice.actions;
export default historySlice.reducer; 