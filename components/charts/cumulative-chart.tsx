'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';

interface CumulativeChartProps {
  data: { date: string; objectif: number; performance: number }[];
  title: string;
}

export default function CumulativeChart({ data, title }: CumulativeChartProps) {
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
            <AreaChart data={safeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
              <Area 
                type="monotone" 
                dataKey="objectif" 
                name="Objectif cumulé" 
                stroke="#EF4444" 
                fill="#FEE2E2" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="performance" 
                name="Performance cumulée" 
                stroke="#009639" 
                fill="#DCFCE7" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
