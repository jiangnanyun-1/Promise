import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exporting: false,
  error: null,
  fileUrl: null
};

const exportSlice = createSlice({
  name: 'exportJob',
  initialState,
  reducers: {
    requestExport() {},
    exportSuccess(state, action) {
      state.exporting = false;
      state.fileUrl = action.payload;
      state.error = null;
    },
    exportFailure(state, action) {
      state.exporting = false;
      state.error = action.payload || '导出失败';
    },
    setExporting(state, action) {
      state.exporting = action.payload;
    },
    clearExport(state) {
      state.fileUrl = null;
      state.error = null;
    }
  }
});

export const { requestExport, exportSuccess, exportFailure, setExporting, clearExport } = exportSlice.actions;
export default exportSlice.reducer; 