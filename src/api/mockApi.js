export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function trendLengthByRange(range) {
  switch (range) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 12; // 按月
    default: return 7;
  }
}

export async function fetchBaseSales(filters) {
  await delay(300);
  const len = trendLengthByRange(filters.timeRange || '7d');
  const trend = Array.from({ length: len }, (_, i) => ({
    x: i + 1,
    y: Math.floor(100 + Math.random() * 400)
  }));
  return {
    summary: {
      total: trend.reduce((a, b) => a + b.y, 0),
      growthRate: Number((Math.random() * 0.3 - 0.05).toFixed(2)),
      period: filters.timeRange
    },
    trend
  };
}

export async function fetchRegionDistribution(filters) {
  await delay(250);
  return {
    regions: ['华东', '华南', '华北', '西部', '东北', '华中'],
    values: [35, 25, 20, 20, 12, 18]
  };
}

export async function fetchProductDetails(filters) {
  await delay(280);
  const categories = ['电子', '家电', '服饰', '日用品', '食品饮料', '医药健康', '美妆个护'];
  const bars = categories.map(() => Math.floor(50 + Math.random() * 250));
  return { categories, bars };
}

export async function fetchChannelBreakdown(filters) {
  await delay(220);
  const channels = ['线上直营', '第三方平台', '线下门店', '经销商'];
  const makeVals = () => channels.map(() => Math.floor(80 + Math.random() * 300));
  const byMacro = {
    east: makeVals(),
    south: makeVals(),
    north: makeVals(),
    west: makeVals()
  };
  const values = makeVals();
  return { channels, values, byMacro };
}

export async function fetchChannelTrend(filters) {
  await delay(240);
  const channels = ['线上直营', '第三方平台', '线下门店', '经销商'];
  const len = trendLengthByRange(filters.timeRange || '7d');
  const x = Array.from({ length: len }, (_, i) => i + 1);
  const series = channels.map(name => ({ name, data: x.map(() => Math.floor(60 + Math.random() * 240)) }));
  return { x, series };
}

export async function fetchKpiSummary(filters) {
  await delay(180);
  return {
    aov: Number((200 + Math.random() * 400).toFixed(2)),
    returnRate: Number((Math.random() * 0.12).toFixed(3)),
    conversion: Number((0.02 + Math.random() * 0.08).toFixed(3))
  };
}

export async function fetchMapDistribution(filters) {
  await delay(260);
  const cities = [
    { name: '上海', value: 320 },
    { name: '北京', value: 300 },
    { name: '广州', value: 260 },
    { name: '深圳', value: 280 },
    { name: '杭州', value: 220 },
    { name: '南京', value: 190 },
    { name: '苏州', value: 170 },
    { name: '成都', value: 210 },
    { name: '重庆', value: 180 },
    { name: '武汉', value: 200 },
    { name: '西安', value: 160 },
    { name: '青岛', value: 140 },
    { name: '济南', value: 120 },
    { name: '厦门', value: 110 },
    { name: '福州', value: 100 },
    { name: '长沙', value: 150 },
    { name: '合肥', value: 130 },
    { name: '郑州', value: 170 },
    { name: '南昌', value: 90 },
    { name: '南宁', value: 95 },
    { name: '昆明', value: 105 },
    { name: '贵阳', value: 85 },
    { name: '哈尔滨', value: 80 },
    { name: '长春', value: 78 },
    { name: '沈阳', value: 88 }
  ];
  return { points: cities };
}

export async function fetchUserPermissions() {
  await delay(150);
  return { canExport: true, canSeeRevenue: true };
}

export async function exportDataApi(filters) {
  await delay(500);
  return { url: 'data:text/csv;base64,ZGF0YSxwbGFjZWhvbGRlcg==' };
} 