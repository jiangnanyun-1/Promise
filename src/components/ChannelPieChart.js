import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#ef4444'];

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

export default function ChannelPieChart({ channels = [], values = [] }) {
  const total = values.reduce((a, b) => a + (b || 0), 0) || 1;
  const data = channels.map((name, i) => ({ name, value: values[i] || 0, percent: (values[i] || 0) / total }));
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
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