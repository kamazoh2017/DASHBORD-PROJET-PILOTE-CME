'use client';

import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'orange' | 'green' | 'blue' | 'red';
}

const colorClasses = {
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  red: 'bg-red-50 text-red-600 border-red-200',
};

const iconBgClasses = {
  orange: 'bg-orange-100',
  green: 'bg-green-100',
  blue: 'bg-blue-100',
  red: 'bg-red-100',
};

export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'orange' 
}: KPICardProps) {
  return (
    <div className={`rounded-xl border p-6 ${colorClasses[color]} transition-shadow hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm mt-1 opacity-70">{subtitle}</p>
          )}
          {trendValue && (
            <p className={`text-sm mt-2 font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
