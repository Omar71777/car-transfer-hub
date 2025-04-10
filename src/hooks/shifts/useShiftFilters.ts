
import { useState, useCallback, useMemo } from 'react';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';
import { Shift } from '@/types';

export function useShiftFilters(shifts: Shift[]) {
  // Filter states
  const [filterDriver, setFilterDriver] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date>(() => endOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Generate days of the week based on selected date range
  const weekDays = useMemo(() => {
    const days = [];
    let currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    
    return days;
  }, [startDate, endDate]);

  // Filter shifts based on selected driver and date range
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const isInDateRange = shiftDate >= startDate && shiftDate <= endDate;
      
      if (!isInDateRange) return false;
      if (filterDriver && shift.driverId !== filterDriver) return false;
      
      return true;
    });
  }, [shifts, filterDriver, startDate, endDate]);

  // Handle filter changes
  const handleDriverFilterChange = useCallback((driverId: string | null) => {
    setFilterDriver(driverId);
  }, []);

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterDriver(null);
    setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  return {
    filterDriver,
    startDate,
    endDate,
    weekDays,
    filteredShifts,
    handleDriverFilterChange,
    handleDateRangeChange,
    resetFilters
  };
}
