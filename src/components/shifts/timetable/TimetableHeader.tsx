
import React, { memo } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimetableHeaderProps {
  hours: number[];
  weekDays: Date[];
}

function TimetableHeaderComponent({ hours, weekDays }: TimetableHeaderProps) {
  // Format weekday name with first letter capitalized
  const formatWeekday = (date: Date) => {
    const weekday = format(date, 'EEEE', { locale: es });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  return (
    <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <TableRow>
        <TableHead className="w-16 py-2 text-center font-medium">Hora</TableHead>
        {weekDays.map(day => {
          const isToday = new Date().toDateString() === day.toDateString();
          return (
            <TableHead 
              key={day.toString()} 
              className={cn(
                "text-center p-1 whitespace-nowrap",
                isToday ? "bg-primary/10" : "bg-muted/30"
              )}
            >
              <div className={cn("font-medium", isToday && "text-primary")}>
                {formatWeekday(day)}
              </div>
              <div className="text-sm font-normal">
                {format(day, 'd MMM', { locale: es })}
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

// Memoize the component to avoid unnecessary re-renders
export const TimetableHeader = memo(TimetableHeaderComponent);
