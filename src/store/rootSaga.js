import { all, call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { fetchBaseSales, fetchRegionDistribution, fetchProductDetails, fetchMapDistribution, fetchUserPermissions, exportDataApi, fetchChannelBreakdown, fetchKpiSummary, fetchChannelTrend } from '../api/mockApi';
import { updateFilters } from './slices/filtersSlice';
import { fetchChartsData, fetchChartsDataSuccess, fetchChartsDataFailure, setChartsLoading } from './slices/chartsSlice';
import { setGlobalLoading, setGlobalError } from './slices/uiSlice';
import { pushHistory } from './slices/historySlice';
import { requestExport, exportSuccess, exportFailure, setExporting } from './slices/exportSlice';

const selectFilters = (state) => state.filters;
const selectCharts = (state) => state.charts;

function* loadChartsWorker() {
  try {
    yield put(setChartsLoading(true));
    yield put(setGlobalLoading(true));
    const filters = yield select(selectFilters);
    const [base, region, product, map, perms, channel, channelTrend, kpi] = yield all([
      call(fetchBaseSales, filters),
      call(fetchRegionDistribution, filters),
      call(fetchProductDetails, filters),
      call(fetchMapDistribution, filters),
      call(fetchUserPermissions),
      call(fetchChannelBreakdown, filters),
      call(fetchChannelTrend, filters),
      call(fetchKpiSummary, filters)
    ]);
    yield put(fetchChartsDataSuccess({ base, region, product, map, channel, channelTrend, kpi }));
    yield put(setGlobalError(null));
    yield put(pushHistory(filters));
  } catch (err) {
    yield put(fetchChartsDataFailure(err?.message || '加载失败'));
    yield put(setGlobalError(err?.message || '加载失败'));
  } finally {
    yield put(setChartsLoading(false));
    yield put(setGlobalLoading(false));
  }
}

function buildCsv(filters, charts) {
  const lines = [];
  lines.push('筛选维度');
  lines.push(`时间范围,${filters.timeRange}`);
  lines.push(`区域,${filters.region}`);
  lines.push('');
  lines.push('KPI 汇总');
  const total = charts?.base?.summary?.total ?? '';
  const aov = charts?.kpi?.aov ?? '';
  const returnRate = charts?.kpi ? (charts.kpi.returnRate * 100).toFixed(2) + '%' : '';
  const conversion = charts?.kpi ? (charts.kpi.conversion * 100).toFixed(2) + '%' : '';
  lines.push(`总销售额(Aggregated),¥${total}`);
  lines.push(`客单价(AOV),¥${aov}`);
  lines.push(`退货率,${returnRate}`);
  lines.push(`转化率,${conversion}`);
  lines.push('');
  lines.push('渠道分布');
  lines.push('渠道,销售额');
  const channels = charts?.channel?.channels || [];
  const cvals = charts?.channel?.values || [];
  channels.forEach((c, i) => lines.push(`${c},${cvals[i] ?? ''}`));
  lines.push('');
  lines.push('渠道趋势');
  const cx = charts?.channelTrend?.x || [];
  const cseries = charts?.channelTrend?.series || [];
  lines.push(['x', ...cseries.map(s => s.name)].join(','));
  cx.forEach((xi, idx) => {
    const row = [xi, ...cseries.map(s => s.data[idx] ?? '')];
    lines.push(row.join(','));
  });
  lines.push('');
  lines.push('产品类别分布');
  lines.push('类别,销售额');
  const cats = charts?.product?.categories || [];
  const pvals = charts?.product?.bars || [];
  cats.forEach((c, i) => lines.push(`${c},${pvals[i] ?? ''}`));
  lines.push('');
  lines.push('趋势数据');
  lines.push('x,y');
  (charts?.base?.trend || []).forEach(pt => lines.push(`${pt.x},${pt.y}`));
  return lines.join('\n');
}

function* exportWorker() {
  try {
    yield put(setExporting(true));
    const filters = yield select(selectFilters);
    const charts = yield select(selectCharts);
    const csv = buildCsv(filters, charts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    yield put(exportSuccess(url));
  } catch (err) {
    yield put(exportFailure(err?.message || '导出失败'));
  } finally {
    yield put(setExporting(false));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest([updateFilters.type, fetchChartsData.type], loadChartsWorker),
    takeEvery(requestExport.type, exportWorker)
  ]);
} 