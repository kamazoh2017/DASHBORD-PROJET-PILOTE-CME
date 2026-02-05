'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

interface ComparisonBarChartProps {
  data: { name: string; supervision: number; application: number; ecart: number }[];
  title: string;
  dataKey?: string;
}

export default function ComparisonBarChart({ data, title }: ComparisonBarChartProps) {
  const safeData = data ?? [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-80">
        {safeData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Aucune donnée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                tick={{ fontSize: 9 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="supervision" name="Supervision" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="application" name="Application" fill="#009639" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
