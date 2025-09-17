import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export default function ChannelTrendChart({ x = [], series = [] }) {
  const data = x.map((xi, idx) => {
    const row = { x: xi };
    series.forEach(s => { row[s.name] = s.data[idx] ?? null; });
    return row;
  });
  const colors = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#ef4444'];
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x">
            <Label value="时间（天/月份）" position="insideBottom" dy={10} fill="#94a3b8" />
          </XAxis>
          <YAxis>
            <Label value="销售额" angle={-90} position="insideLeft" dx={10} fill="#94a3b8" />
          </YAxis>
          <Tooltip formatter={(value, name) => [value, `渠道：${name}`]} labelFormatter={(label) => `时间：${label}`} />
          <Legend />
          {series.map((s, i) => (
            <Line key={s.name} type="monotone" dataKey={s.name} stroke={colors[i % colors.length]} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 