
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimetableHeaderProps {
  hours: number[];
  weekDays: Date[];
}

export function TimetableHeader({ hours, weekDays }: TimetableHeaderProps) {
  // Debug: Log the weekDays to see what dates we're working with
  console.log('TimetableHeader - weekDays:', weekDays.map(day => ({
    date: day.toISOString(),
    formatted: format(day, 'yyyy-MM-dd')
  })));

  return (
    <TableHeader>
      <TableRow>
        {/* First cell is empty/corner cell */}
        <TableHead className="text-center font-semibold sticky left-0 bg-background z-10 min-w-[70px] border-r">
          Hora
        </TableHead>
        
        {/* Display days as column headers */}
        {weekDays.map((day) => (
          <TableHead 
            key={day.toString()} 
            className={`text-center whitespace-nowrap py-3 min-w-[130px] ${
              day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/30' : ''
            }`}
          >
            <div className="font-medium">
              {format(day, 'EEEE', { locale: es })}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(day, 'd MMM', { locale: es })}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
