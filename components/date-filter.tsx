'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECT_START_DATE, PROJECT_END_DATE, isWorkingDay, formatDateFR } from '@/lib/constants';

interface DateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates?: string[];
}

export default function DateFilter({ selectedDate, onDateChange, availableDates }: DateFilterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    let prevDay = new Date(current);
    prevDay.setDate(prevDay.getDate() - 1);
    
    while (!isWorkingDay(prevDay) && prevDay >= PROJECT_START_DATE) {
      prevDay.setDate(prevDay.getDate() - 1);
    }
    
    if (prevDay >= PROJECT_START_DATE) {
      onDateChange(prevDay.toISOString().split('T')[0]);
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    let nextDay = new Date(current);
    nextDay.setDate(nextDay.getDate() + 1);
    
    while (!isWorkingDay(nextDay) && nextDay <= PROJECT_END_DATE) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    if (nextDay <= PROJECT_END_DATE) {
      onDateChange(nextDay.toISOString().split('T')[0]);
    }
  };

  if (!mounted) {
    return <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />;
  }

  const currentDate = new Date(selectedDate);
  const canGoPrev = currentDate > PROJECT_START_DATE;
  const canGoNext = currentDate < PROJECT_END_DATE;

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow-md p-4">
      <Calendar className="text-orange-500" size={24} />
      <span className="text-gray-600 font-medium">Date sélectionnée:</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevDay}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={PROJECT_START_DATE.toISOString().split('T')[0]}
          max={PROJECT_END_DATE.toISOString().split('T')[0]}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        
        <button
          onClick={handleNextDay}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <span className="text-gray-500 text-sm ml-4">
        {formatDateFR(selectedDate)}
        {!isWorkingDay(currentDate) && (
          <span className="ml-2 text-orange-500">(Week-end)</span>
        )}
      </span>
    </div>
  );
}
