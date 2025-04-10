
import React from 'react';
import { Driver } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilterIcon, XIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimetableFiltersProps {
  drivers: Driver[];
  selectedDriver: string | null;
  onDriverChange: (driverId: string | null) => void;
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onResetFilters: () => void;
}

export function TimetableFilters({
  drivers,
  selectedDriver,
  onDriverChange,
  startDate,
  endDate,
  onDateRangeChange,
  onResetFilters
}: TimetableFiltersProps) {
  // Function to set a specific week
  const setWeek = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // End on Sunday
    onDateRangeChange(weekStart, weekEnd);
  };

  // Go to previous week
  const goToPreviousWeek = () => {
    const newStartDate = addDays(startDate, -7);
    const newEndDate = addDays(endDate, -7);
    onDateRangeChange(newStartDate, newEndDate);
  };

  // Go to next week
  const goToNextWeek = () => {
    const newStartDate = addDays(startDate, 7);
    const newEndDate = addDays(endDate, 7);
    onDateRangeChange(newStartDate, newEndDate);
  };

  // Go to current week
  const goToCurrentWeek = () => {
    setWeek(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      
      {/* Driver filter */}
      <div className="flex-1">
        <Select 
          value={selectedDriver || "all"} 
          onValueChange={(value) => onDriverChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todos los conductores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los conductores</SelectItem>
            {drivers.map(driver => (
              <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Date range filter with week navigation */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {format(startDate, 'dd MMM', { locale: es })} - {format(endDate, 'dd MMM', { locale: es })}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setWeek(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            <div className="p-3 border-t flex justify-between">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>Semana anterior</Button>
              <Button variant="outline" size="sm" onClick={goToCurrentWeek}>Semana actual</Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>Semana siguiente</Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Reset filters button */}
        {(selectedDriver || 
          format(startDate, 'yyyy-MM-dd') !== format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onResetFilters} 
            title="Reiniciar filtros"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
