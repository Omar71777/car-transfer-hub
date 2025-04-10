
import React, { useState, useEffect } from 'react';
import { Shift, Driver } from '@/types';
import { format, eachDayOfInterval, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';

export function ShiftOverview() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
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
  }, []);

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name.split(' ')[0] : '?'; // Return first name only
  };

  const getShiftForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return shifts.find(shift => shift.date === dateStr);
  };

  return (
    <div className="overflow-hidden">
      <div className="flex rounded-lg overflow-hidden border border-border/50 h-[168px]">
        {weekDays.map((day) => {
          const shift = getShiftForDay(day);
          
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
                {shift ? (
                  <div className={`absolute inset-0 mx-1 ${
                    shift.isFullDay 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-secondary/10 border border-secondary/30'
                  } rounded-md flex flex-col items-center justify-center text-xs transition-all hover:scale-[1.02]`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                      shift.isFullDay 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      <Clock className="h-3 w-3" />
                    </div>
                    <div className="font-medium">{getDriverName(shift.driverId)}</div>
                    <div className={`text-[10px] mt-1 px-1.5 py-0.5 rounded-full ${
                      shift.isFullDay 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {shift.isFullDay ? '24h' : '12h'}
                    </div>
                  </div>
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
