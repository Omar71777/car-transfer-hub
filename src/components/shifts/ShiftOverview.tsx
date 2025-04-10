
import React, { useState, useEffect } from 'react';
import { Shift, Driver } from '@/types';
import { format, eachDayOfInterval, startOfWeek, addDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function ShiftOverview() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    // Load shifts
    const storedShifts = localStorage.getItem('shifts');
    const parsedShifts = storedShifts ? JSON.parse(storedShifts) : [];
    setShifts(parsedShifts);

    // Load drivers
    const storedDrivers = localStorage.getItem('drivers');
    const parsedDrivers = storedDrivers ? JSON.parse(storedDrivers) : [];
    setDrivers(parsedDrivers);

    // Calculate days of the current week
    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
    const days = eachDayOfInterval({ 
      start: startDay, 
      end: addDays(startDay, 6) 
    });
    setWeekDays(days);
    setLoading(false);
  }, []);

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name.split(' ')[0] : '?'; // Return first name only
  };

  const getShiftsForDay = (day: Date): Shift[] => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateStr);
  };

  // Get shift type with most hours in a day (prioritizing 24h shifts)
  const getDominantShiftType = (dayShifts: Shift[]): 'full' | 'half' | null => {
    if (dayShifts.length === 0) return null;

    const has24hShift = dayShifts.some(shift => shift.isFullDay);
    if (has24hShift) return 'full';

    return 'half';
  };

  // Get main driver for the day (if multiple, prefer 24h shift driver)
  const getMainDriverForDay = (dayShifts: Shift[]): string | null => {
    if (dayShifts.length === 0) return null;

    // First try to find a full day shift
    const fullDayShift = dayShifts.find(shift => shift.isFullDay);
    if (fullDayShift) return getDriverName(fullDayShift.driverId);

    // If no full day shift, show the driver with the first shift
    return getDriverName(dayShifts[0].driverId);
  };

  // Get multiple shifts info for tooltip
  const getDetailedShiftInfo = (dayShifts: Shift[]) => {
    return dayShifts.map(shift => {
      const driverName = getDriverName(shift.driverId);
      const shiftType = shift.isFullDay ? 'Turno 24h' : 'Turno 12h';
      const hours = shift.isFullDay ? '24h' : 
        `${shift.startHour}:00 - ${(shift.startHour || 0) + 12}:00`;
      
      return { driverName, shiftType, hours };
    });
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[168px] w-full rounded-lg" />
        <div className="flex justify-center mt-4 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex rounded-lg overflow-hidden border border-border/50 h-[168px]">
        {weekDays.map((day) => {
          const dayShifts = getShiftsForDay(day);
          const shiftType = getDominantShiftType(dayShifts);
          const mainDriver = getMainDriverForDay(dayShifts);
          const hasMultipleShifts = dayShifts.length > 1;
          const detailedInfo = getDetailedShiftInfo(dayShifts);
          
          return (
            <div key={day.toString()} className="flex-1 border-r last:border-r-0 border-border/30">
              {/* Day header */}
              <div className="text-center py-1 text-xs font-medium bg-muted/30">
                {format(day, 'EEE', { locale: es })}
              </div>
              
              {/* Day number */}
              <div className="text-center py-1 text-sm">
                {format(day, 'd')}
              </div>
              
              {/* Shift content */}
              <div className="h-[120px] relative">
                {dayShifts.length > 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "absolute inset-0 mx-1 rounded-md flex flex-col items-center justify-center text-xs transition-all hover:scale-[1.02]",
                          shiftType === 'full' 
                            ? "bg-primary/10 border border-primary/30" 
                            : "bg-secondary/10 border border-secondary/30"
                        )}>
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center mb-1",
                            shiftType === 'full' 
                              ? "bg-primary/20 text-primary" 
                              : "bg-secondary/20 text-secondary"
                          )}>
                            <Clock className="h-3 w-3" />
                          </div>
                          <div className="font-medium">{mainDriver}</div>
                          <div className={cn(
                            "text-[10px] mt-1 px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                            shiftType === 'full' 
                              ? "bg-primary/20 text-primary" 
                              : "bg-secondary/20 text-secondary"
                          )}>
                            {hasMultipleShifts && <Info className="h-2 w-2" />}
                            {shiftType === 'full' ? '24h' : '12h'}
                          </div>
                        </div>
                      </TooltipTrigger>
                      {hasMultipleShifts && (
                        <TooltipContent side="top" className="max-w-[200px] p-2 z-50">
                          <div className="space-y-2 text-xs">
                            <p className="font-semibold">Múltiples turnos:</p>
                            <ul className="space-y-1.5">
                              {detailedInfo.map((info, index) => (
                                <li key={index} className="flex flex-col">
                                  <span className="font-medium">{info.driverName}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {info.shiftType} • {info.hours}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="absolute inset-0 mx-1 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground/50">Sin turno</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-4 gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary/30 mr-1.5"></div>
          <span className="text-muted-foreground">Turno 24h</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-secondary/30 mr-1.5"></div>
          <span className="text-muted-foreground">Turno 12h</span>
        </div>
      </div>
    </div>
  );
}
