
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
    <TableHeader>
      <TableRow>
        <TableHead className="w-24">Hora / Día</TableHead>
        {weekDays.map(day => (
          <TableHead key={day.toString()} className="text-center p-1 whitespace-nowrap">
            {format(day, 'EEEE, d', { locale: es })}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
