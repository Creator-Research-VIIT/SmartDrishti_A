import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  timestamp: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  title?: string;
  dataKey?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, title, dataKey = 'value' }) => {
  // Transform data to include time in a readable format
  const transformedData = data.map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString(),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
