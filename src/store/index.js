import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import filtersReducer from './slices/filtersSlice';
import chartsReducer from './slices/chartsSlice';
import uiReducer from './slices/uiSlice';
import historyReducer from './slices/historySlice';
import exportReducer from './slices/exportSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    charts: chartsReducer,
    ui: uiReducer,
    history: historyReducer,
    exportJob: exportReducer
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga); 