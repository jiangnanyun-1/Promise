import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c'];

function formatTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const p = payload[0];
    const name = p.name;
    const value = p.value;
    const percent = p.payload && p.payload.percent != null ? (p.payload.percent * 100).toFixed(1) + '%' : '';
    return (
      <div style={{ background: '#111827', color: '#e5e7eb', border: '1px solid #1f2937', padding: 8, borderRadius: 8 }}>
        <div>{name}</div>
        <div>占比：{percent}</div>
        <div>数值：{value}</div>
      </div>
    );
  }
  return null;
}

export default function RegionPieChart({ regions = [], values = [] }) {
  const total = values.reduce((a, b) => a + (b || 0), 0) || 1;
  const data = regions.map((name, i) => ({ name, value: values[i] || 0, percent: (values[i] || 0) / total }));
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            stroke="#0b1220"
            activeIndex={activeIndex}
            onMouseEnter={(_, idx) => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(-1)}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={formatTooltip} />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 