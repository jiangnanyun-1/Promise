import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const CITY_COORDS = {
  '上海': [121.4737, 31.2304],
  '北京': [116.4074, 39.9042],
  '广州': [113.2644, 23.1291],
  '深圳': [114.0579, 22.5431],
  '杭州': [120.1551, 30.2741],
  '南京': [118.7969, 32.0603],
  '苏州': [120.5853, 31.2989],
  '成都': [104.0665, 30.5728],
  '重庆': [106.5516, 29.5630],
  '武汉': [114.3055, 30.5931],
  '西安': [108.9398, 34.3416],
  '青岛': [120.3826, 36.0671],
  '济南': [117.1201, 36.6512],
  '厦门': [118.0894, 24.4798],
  '福州': [119.2965, 26.0745],
  '长沙': [112.9389, 28.2282],
  '合肥': [117.2272, 31.8206],
  '郑州': [113.6254, 34.7466],
  '南昌': [115.8582, 28.6829],
  '南宁': [108.3669, 22.8170],
  '昆明': [102.8330, 24.8801],
  '贵阳': [106.6302, 26.6470],
  '哈尔滨': [126.6425, 45.7567],
  '长春': [125.3235, 43.8171],
  '沈阳': [123.4315, 41.8057]
};

const PROVINCES_BY_MACRO = {
  east: ['上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省'],
  south: ['广东省','广西壮族自治区','海南省'],
  north: ['北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省'],
  west: ['重庆市','四川省','贵州省','云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区']
};

function macroOfProvince(name) {
  for (const k of Object.keys(PROVINCES_BY_MACRO)) {
    if (PROVINCES_BY_MACRO[k].includes(name)) return k;
  }
  return 'all';
}

function topChannel(channels = [], values = []) {
  let idx = -1, max = -Infinity;
  values.forEach((v, i) => { if ((v ?? -Infinity) > max) { max = v; idx = i; } });
  return idx >= 0 ? `${channels[idx]}：${values[idx]}` : '—';
}

export default function ChinaMap({ points = [], selectedMacro = 'all', summaryByMacro = {}, kpi = null, channel = null, onProvinceClick }) {
  const seriesData = points
    .filter((p) => CITY_COORDS[p.name])
    .map((p) => ({ name: p.name, value: [...CITY_COORDS[p.name], p.value] }));

  const heatRange = useMemo(() => {
    const vals = seriesData.map(d => d.value?.[2]).filter(v => typeof v === 'number');
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 200;
    return { min, max: Math.max(max, min + 1) };
  }, [seriesData]);

  const mapData = useMemo(() => {
    const provinces = [].concat(
      PROVINCES_BY_MACRO.east,
      PROVINCES_BY_MACRO.south,
      PROVINCES_BY_MACRO.north,
      PROVINCES_BY_MACRO.west
    );
    return provinces.map((name) => ({
      name,
      value: selectedMacro === 'all' ? 0 : (PROVINCES_BY_MACRO[selectedMacro] || []).includes(name) ? 1 : 0
    }));
  }, [selectedMacro]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.seriesType === 'map') {
          const macro = macroOfProvince(params.name);
          const title = `${params.name}`;
          const total = summaryByMacro[macro] ?? '—';
          const aov = kpi ? `AOV：¥${kpi.aov}` : '';
          const rr = kpi ? `退货率：${(kpi.returnRate * 100).toFixed(1)}%` : '';
          const cv = kpi ? `转化率：${(kpi.conversion * 100).toFixed(1)}%` : '';
          const top = channel ? `渠道Top：${topChannel(channel.channels, channel.values)}` : '';
          return [title, `区域汇总：${total}`, aov, rr, cv, top].filter(Boolean).join('<br/>');
        }
        if (params.seriesType === 'effectScatter' || params.seriesType === 'heatmap') {
          const [lng, lat, v] = params.value || [];
          return `${params.name || '城市'}<br/>销售额：${v ?? '—'}`;
        }
        return params.name;
      }
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      itemStyle: { areaColor: '#131a2b', borderColor: '#2b3345' },
      emphasis: { itemStyle: { areaColor: '#1e2a44' } }
    },
    visualMap: [
      selectedMacro === 'all'
        ? { min: 0, max: 0, show: false, seriesIndex: 0, inRange: { color: ['#0b1220', '#2563eb'] } }
        : { min: 0, max: 1, show: false, seriesIndex: 0, inRange: { color: ['#0b1220', '#2563eb'] } },
      { min: heatRange.min, max: heatRange.max, show: false, seriesIndex: 1, inRange: { color: ['#1f2937', '#2563eb', '#22d3ee'] } }
    ],
    series: [
      {
        name: '区域高亮',
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: mapData,
        silent: false
      },
      {
        name: '密度热力',
        type: 'heatmap',
        coordinateSystem: 'geo',
        data: seriesData.map(d => ({ name: d.name, value: d.value })),
        pointSize: 8,
        blurSize: 12
      },
      {
        name: '增长涟漪',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        rippleEffect: { brushType: 'stroke', scale: 3 },
        symbolSize: (val) => Math.min(20, 4 + (val[2] || 0) / 10),
        data: seriesData
      }
    ]
  }), [mapData, seriesData, selectedMacro, summaryByMacro, heatRange, kpi, channel]);

  const onEvents = useMemo(() => ({
    click: (params) => {
      if (params.componentType === 'series' && params.seriesType === 'map') {
        const macro = macroOfProvince(params.name);
        if (onProvinceClick) onProvinceClick({ province: params.name, macro });
      }
    }
  }), [onProvinceClick]);

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ReactECharts option={option} onEvents={onEvents} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
    </div>
  );
} 