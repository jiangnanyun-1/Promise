import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../store/slices/filtersSlice';
import { fetchChartsData } from '../store/slices/chartsSlice';
import { requestExport, clearExport } from '../store/slices/exportSlice';
import TrendLineChart from '../components/TrendLineChart';
import RegionPieChart from '../components/RegionPieChart';
import ProductBarChart from '../components/ProductBarChart';
import ChannelBarChart from '../components/ChannelBarChart';
import ChannelPieChart from '../components/ChannelPieChart';
import ChannelTrendChart from '../components/ChannelTrendChart';
import ChinaMap from '../components/ChinaMap';
import * as echarts from 'echarts';

function useRegisterChinaMap() {
  const [mapReady, setMapReady] = useState(!!echarts.getMap('china'));
  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        if (!echarts.getMap('china')) {
          const res = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=100000');
          const geo = await res.json();
          if (!cancelled) {
            echarts.registerMap('china', geo);
            setMapReady(true);
          }
        } else {
          if (!cancelled) setMapReady(true);
        }
      } catch (e) {
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);
  return mapReady;
}

function Filters() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);
  function onChange(e) {
    const { name, value } = e.target;
    dispatch(updateFilters({ [name]: value }));
  }
  return (
    <div className="filters">
      <select className="select" name="timeRange" value={filters.timeRange} onChange={onChange}>
        <option value="7d">近7天</option>
        <option value="30d">近30天</option>
        <option value="90d">近90天</option>
        <option value="1y">近1年</option>
      </select>
      <select className="select" name="region" value={filters.region} onChange={onChange}>
        <option value="all">全区域</option>
        <option value="east">华东</option>
        <option value="south">华南</option>
        <option value="north">华北</option>
        <option value="west">西部</option>
      </select>
      <select className="select" name="category" value={filters.category} onChange={onChange}>
        <option value="all">全部品类</option>
        <option value="electronics">电子</option>
        <option value="appliance">家电</option>
      </select>
      <select className="select" name="customer" value={filters.customer} onChange={onChange}>
        <option value="all">全部客户</option>
        <option value="vip">VIP</option>
        <option value="new">新客</option>
      </select>
    </div>
  );
}

function KpiCards() {
  const kpi = useSelector((s) => s.charts.kpi);
  const total = useSelector((s) => s.charts.base?.summary?.total || 0);
  if (!kpi) return null;
  return (
    <div className="grid" style={{ marginBottom: 16 }}>
      <div className="card" style={{ gridColumn: 'span 3' }}>
        <div className="card-header"><h4 className="card-title">客单价（AOV）</h4></div>
        <div className="card-body"><div style={{ fontSize: 24 }}>¥ {kpi.aov}</div></div>
      </div>
      <div className="card" style={{ gridColumn: 'span 3' }}>
        <div className="card-header"><h4 className="card-title">退货率</h4></div>
        <div className="card-body"><div style={{ fontSize: 24 }}>{(kpi.returnRate * 100).toFixed(1)}%</div></div>
      </div>
      <div className="card" style={{ gridColumn: 'span 3' }}>
        <div className="card-header"><h4 className="card-title">转化率</h4></div>
        <div className="card-body"><div style={{ fontSize: 24 }}>{(kpi.conversion * 100).toFixed(1)}%</div></div>
      </div>
      <div className="card" style={{ gridColumn: 'span 3' }}>
        <div className="card-header"><h4 className="card-title">总销售额</h4></div>
        <div className="card-body"><div style={{ fontSize: 24 }}>¥ {total}</div></div>
      </div>
    </div>
  );
}

function Toolbar() {
  const dispatch = useDispatch();
  const exporting = useSelector((s) => s.exportJob.exporting);
  const fileUrl = useSelector((s) => s.exportJob.fileUrl);
  return (
    <div className="toolbar">
      <button className="button ghost" onClick={() => dispatch(fetchChartsData())}>手动刷新</button>
      <button className="button primary" disabled={exporting} onClick={() => dispatch(requestExport())}>
        {exporting ? '导出中...' : '导出数据'}
      </button>
      {fileUrl && (
        <a className="button" href={fileUrl} download="sales.csv" onClick={() => dispatch(clearExport())}>下载导出文件</a>
      )}
    </div>
  );
}

function Charts() {
  const mapReady = useRegisterChinaMap();
  const { base, region, product, map, channel, channelTrend, kpi, loading, error } = useSelector((s) => s.charts);
  const selectedMacro = useSelector((s) => s.filters.region);

  const filteredChannel = useMemo(() => {
    if (!channel) return channel;
    if (selectedMacro === 'all') return channel;
    const vals = channel.byMacro?.[selectedMacro] || channel.values || [];
    return { ...channel, values: vals };
  }, [channel, selectedMacro]);

  function computeSummaryByMacro(points) {
    const macroDict = {
      east: ['上海','南京','苏州','杭州','青岛','济南','厦门','福州'],
      south: ['广州','深圳','南宁'],
      north: ['北京','天津','沈阳','长春','哈尔滨','青岛','济南'],
      west: ['成都','重庆','西安','昆明','贵阳','武汉','郑州','长沙','合肥','南昌']
    };
    const result = { east: 0, south: 0, north: 0, west: 0 };
    (points || []).forEach(p => {
      const name = p.name;
      const value = Number(p.value) || 0;
      for (const k of Object.keys(macroDict)) {
        if (macroDict[k].includes(name)) {
          result[k] += value;
          break;
        }
      }
    });
    return result;
  }

  const summaryByMacro = computeSummaryByMacro(map?.points || []);

  const dispatch = useDispatch();
  function handleProvinceClick(payload) {
    if (!payload) return;
    if (payload.macro && payload.macro !== 'all') {
      dispatch(updateFilters({ region: payload.macro }));
    }
  }
  if (loading) return <div className="loading">图表加载中...</div>;
  if (error) return <div className="error">图表加载失败：{error}</div>;
  return (
    <>
      <KpiCards />
      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">销售趋势</h4></div>
          <div className="card-body"><TrendLineChart data={base?.trend || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">区域占比</h4></div>
          <div className="card-body"><RegionPieChart regions={region?.regions || []} values={region?.values || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">产品对比</h4></div>
          <div className="card-body"><ProductBarChart categories={product?.categories || []} bars={product?.bars || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">渠道趋势</h4></div>
          <div className="card-body"><ChannelTrendChart x={channelTrend?.x || []} series={channelTrend?.series || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">渠道分布（柱状）</h4></div>
          <div className="card-body"><ChannelBarChart channels={filteredChannel?.channels || []} values={filteredChannel?.values || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">渠道占比（饼图）</h4></div>
          <div className="card-body"><ChannelPieChart channels={filteredChannel?.channels || []} values={filteredChannel?.values || []} /></div>
        </div>
        <div className="card" style={{ gridColumn: 'span 6' }}>
          <div className="card-header"><h4 className="card-title">销售地图</h4></div>
          <div className="card-body">
            {mapReady ? (
              <ChinaMap
                points={map?.points || []}
                selectedMacro={selectedMacro}
                summaryByMacro={summaryByMacro}
                kpi={kpi}
                channel={filteredChannel}
                onProvinceClick={handleProvinceClick}
              />
            ) : (
              <div className="loading">地图加载中...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DataTable() {
  const product = useSelector((s) => s.charts.product);
  const categories = product?.categories || [];
  const bars = product?.bars || [];
  return (
    <table className="table">
      <thead>
        <tr>
          <th>类别</th>
          <th>销售额</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((c, i) => (
          <tr key={c}>
            <td>{c}</td>
            <td>{bars[i]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchChartsData());
  }, [dispatch]);
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <Filters />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Toolbar />
      </div>
      <Charts />
      <div style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-header"><h4 className="card-title">产品明细</h4></div>
          <div className="card-body">
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
} 