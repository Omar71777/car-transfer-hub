
import React from 'react';
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
  return (
    <TableBody>
      {hours.map(hour => (
        <TableRow key={hour}>
          <TableCell className="font-medium whitespace-nowrap">
            {hour}:00
          </TableCell>
          
          {weekDays.map(day => {
            const driverInfo = getShiftForTimeSlot(day, hour, filteredShifts, getDriverDetails);
            
            return (
              <ShiftCell
                key={day.toString()}
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
