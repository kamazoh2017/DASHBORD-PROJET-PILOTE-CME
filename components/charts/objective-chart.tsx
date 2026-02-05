'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { DAILY_OBJECTIVE } from '@/lib/constants';

interface ObjectiveChartProps {
  data: { name: string; enregistrees: number; connectees: number }[];
  title: string;
  showObjectiveLine?: boolean;
  objectiveValue?: number;
}

export default function ObjectiveChart({ 
  data, 
  title, 
  showObjectiveLine = true,
  objectiveValue = DAILY_OBJECTIVE 
}: ObjectiveChartProps) {
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
            <BarChart data={safeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Legend 
                verticalAlign="top" 
                wrapperStyle={{ fontSize: 11 }}
              />
              {showObjectiveLine && (
                <ReferenceLine 
                  y={objectiveValue} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5" 
                  label={{ value: `Objectif: ${objectiveValue}`, fill: '#EF4444', fontSize: 10 }}
                />
              )}
              <Bar dataKey="enregistrees" name="Enregistrées" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="connectees" name="Connectées" fill="#009639" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
