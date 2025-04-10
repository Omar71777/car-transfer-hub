
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TimetableHeaderProps {
  hours: number[];
}

export function TimetableHeader({ hours }: TimetableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-24">Día / Hora</TableHead>
        {hours.map(hour => (
          <TableHead key={hour} className="text-center w-14 p-1">
            {hour}:00
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
