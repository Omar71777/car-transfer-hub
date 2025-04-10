
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimetableHeaderProps {
  hours: number[];
  weekDays: Date[];
}

export function TimetableHeader({ hours, weekDays }: TimetableHeaderProps) {
  return (
    <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <TableRow>
        <TableHead className="w-16 py-2 text-center font-medium">Hora</TableHead>
        {weekDays.map(day => (
          <TableHead 
            key={day.toString()} 
            className="text-center p-1 whitespace-nowrap bg-muted/30"
          >
            <div className="font-medium">{format(day, 'EEEE', { locale: es })}</div>
            <div className="text-sm font-normal">{format(day, 'd MMM', { locale: es })}</div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
