'use client';

import { useState, useEffect } from 'react';
import { Calendar, CalendarRange } from 'lucide-react';
import { PROJECT_START_DATE, PROJECT_END_DATE, formatDateFR } from '@/lib/constants';

interface PeriodFilterProps {
  startDate: string;
  endDate: string;
  onPeriodChange: (startDate: string, endDate: string) => void;
}

export default function PeriodFilter({ startDate, endDate, onPeriodChange }: PeriodFilterProps) {
  const [mounted, setMounted] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = (newStartDate: string) => {
    setLocalStartDate(newStartDate);
    // Si la date de début est après la date de fin, ajuster la date de fin
    if (newStartDate > localEndDate) {
      setLocalEndDate(newStartDate);
      onPeriodChange(newStartDate, newStartDate);
    } else {
      onPeriodChange(newStartDate, localEndDate);
    }
  };

  const handleEndDateChange = (newEndDate: string) => {
    setLocalEndDate(newEndDate);
    // Si la date de fin est avant la date de début, ajuster la date de début
    if (newEndDate < localStartDate) {
      setLocalStartDate(newEndDate);
      onPeriodChange(newEndDate, newEndDate);
    } else {
      onPeriodChange(localStartDate, newEndDate);
    }
  };

  const minDate = PROJECT_START_DATE.toISOString().split('T')[0];
  const maxDate = PROJECT_END_DATE.toISOString().split('T')[0];

  // Raccourcis de période
  const setToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (todayStr >= minDate && todayStr <= maxDate) {
      onPeriodChange(todayStr, todayStr);
    }
  };

  const setThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
    const startStr = startOfWeek.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    onPeriodChange(
      startStr >= minDate ? startStr : minDate,
      todayStr <= maxDate ? todayStr : maxDate
    );
  };

  const setAllPeriod = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    onPeriodChange(minDate, todayStr <= maxDate ? todayStr : maxDate);
  };

  if (!mounted) {
    return <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarRange className="text-orange-500" size={24} />
          <span className="text-gray-700 font-medium">Période :</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Du</label>
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Au</label>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={setToday}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Aujourd'hui
          </button>
          <button
            onClick={setThisWeek}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cette semaine
          </button>
          <button
            onClick={setAllPeriod}
            className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            Toute la période
          </button>
        </div>

        <div className="text-sm text-gray-500 ml-auto">
          {formatDateFR(localStartDate)} → {formatDateFR(localEndDate)}
        </div>
      </div>
    </div>
  );
}
