
import React from 'react';
import { Shift } from '@/types';
import { isSameDay } from 'date-fns';
import { Clock } from 'lucide-react';

interface ShiftCalendarDayProps {
  date: Date;
  shifts: Shift[];
  getDriverNameById: (id: string) => string;
}

export function ShiftCalendarDay({ date, shifts, getDriverNameById }: ShiftCalendarDayProps) {
  // Find shift for this date
  const shift = shifts.find(shift => isSameDay(new Date(shift.date), date));
  
  if (!shift) return null;

  const driverName = getDriverNameById(shift.driverId);
  const shortName = driverName.split(' ')[0]; // Get first name only for display
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      {shift.isFullDay ? (
        <div className="absolute inset-0 rounded-md" style={{ backgroundColor: 'hsl(var(--shift-24h-light))' }}>
          <div className="absolute top-0 left-0 right-0 px-1 py-0.5 rounded-t-md text-center font-medium truncate text-[10px] text-white" style={{ backgroundColor: 'hsl(var(--shift-24h))' }}>
            {shortName}
          </div>
          <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--shift-24h))' }}>
            <Clock className="h-2 w-2 text-white" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 rounded-md" style={{ backgroundColor: 'hsl(var(--shift-12h-light))' }}>
          <div className="absolute top-0 left-0 right-0 px-1 py-0.5 rounded-t-md text-center font-medium truncate text-[10px] text-white" style={{ backgroundColor: 'hsl(var(--shift-12h))' }}>
            {shortName}
          </div>
          <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--shift-12h))' }}>
            <Clock className="h-2 w-2 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
