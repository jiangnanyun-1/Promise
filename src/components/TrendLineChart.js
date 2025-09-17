import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function TrendLineChart({ data }) {
  const chartData = (data || []).map((d) => ({ x: d.x, y: d.y }));
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x">
            <Label value="时间（天/月份）" position="insideBottom" dy={10} fill="#94a3b8" />
          </XAxis>
          <YAxis>
            <Label value="销售额" angle={-90} position="insideLeft" dx={10} fill="#94a3b8" />
          </YAxis>
          <Tooltip formatter={(value) => [value, '销售额']} labelFormatter={(label) => `时间：${label}`} />
          <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 