
import React, { useMemo } from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Shift } from '@/types';
import { ShiftCell } from './ShiftCell';

interface TimetableBodyProps {
  weekDays: Date[];
  hours: number[];
  filteredShifts: Shift[];
  getDriverDetails: (driverId: string) => { name: string; color: string };
  handleCellClick: (day: Date, hour: number) => void;
  handleMouseDown: (day: Date, hour: number) => void;
  handleMouseOver: (day: Date, hour: number) => void;
  isDragging: boolean;
  isInSelectionRange: (day: Date, hour: number) => boolean;
  getShiftForTimeSlot: (day: Date, hour: number, shifts: Shift[], getDriverDetails: any) => { 
    name: string; 
    color: string; 
    shiftId: string;
    type?: 'half' | 'full' | 'free';
    startHour?: number;
    endHour?: number;
  } | null;
}

export function TimetableBody({ 
  weekDays, 
  hours, 
  filteredShifts, 
  getDriverDetails,
  handleCellClick,
  handleMouseDown,
  handleMouseOver,
  isDragging,
  isInSelectionRange,
  getShiftForTimeSlot
}: TimetableBodyProps) {
  // Pre-calculate all driver info for each cell to improve performance
  const cellDriverInfo = useMemo(() => {
    const result: Record<string, Record<number, ReturnType<typeof getShiftForTimeSlot>>> = {};
    
    weekDays.forEach(day => {
      const dayStr = day.toISOString();
      result[dayStr] = {};
      
      hours.forEach(hour => {
        result[dayStr][hour] = getShiftForTimeSlot(day, hour, filteredShifts, getDriverDetails);
      });
    });
    
    return result;
  }, [weekDays, hours, filteredShifts, getDriverDetails, getShiftForTimeSlot]);
  
  return (
    <TableBody>
      {/* Create a row for each hour */}
      {hours.map(hour => (
        <TableRow key={hour} className={hour % 2 === 0 ? 'bg-muted/10' : ''}>
          {/* Hour cell (first column) */}
          <TableCell className="font-medium text-center whitespace-nowrap sticky left-0 bg-background/95 border-r z-10">
            {hour.toString().padStart(2, '0')}:00
          </TableCell>
          
          {/* Create cells for each day */}
          {weekDays.map(day => {
            const dayStr = day.toISOString();
            const driverInfo = cellDriverInfo[dayStr][hour];
            
            return (
              <ShiftCell
                key={day.toString() + hour}
                day={day}
                hour={hour}
                driverInfo={driverInfo}
                onClick={handleCellClick}
                onMouseDown={handleMouseDown}
                onMouseOver={handleMouseOver}
                isDragging={isDragging}
                isInSelectionRange={isInSelectionRange(day, hour)}
              />
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
