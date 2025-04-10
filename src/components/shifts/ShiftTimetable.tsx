
import React, { useMemo } from 'react';
import { format, addHours, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval, addMinutes, setHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shift, Driver } from '@/types';

interface ShiftTimetableProps {
  shifts: Shift[];
  drivers: Driver[];
}

export function ShiftTimetable({ shifts, drivers }: ShiftTimetableProps) {
  // Generate hours for columns (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate days of the week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Create a color map for drivers
  const driverColors = useMemo(() => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500',
      'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500'
    ];
    
    return drivers.reduce((acc, driver, index) => {
      acc[driver.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [drivers]);

  // Helper to get driver details
  const getDriverDetails = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return {
      name: driver ? driver.name : 'Desconocido',
      color: driverColors[driverId] || 'bg-gray-500'
    };
  };

  // Function to calculate shift coverage for a specific hour on a specific day
  const getShiftForTimeSlot = (day: Date, hour: number) => {
    const cellDateTime = new Date(day);
    cellDateTime.setHours(hour, 0, 0, 0);
    
    // Check which shift covers this time slot
    for (const shift of shifts) {
      const shiftDate = parseISO(shift.date);
      
      if (shift.isFullDay) {
        // For 24h shifts that start at the given date
        const shiftStart = new Date(shiftDate);
        shiftStart.setHours(0, 0, 0, 0);
        
        const shiftEnd = new Date(shiftDate);
        shiftEnd.setHours(23, 59, 59, 999);
        
        if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
          return getDriverDetails(shift.driverId);
        }
      } else {
        // For 12h shifts (assuming 10:00 to 22:00)
        const shiftStart = new Date(shiftDate);
        shiftStart.setHours(10, 0, 0, 0);
        
        const shiftEnd = new Date(shiftDate);
        shiftEnd.setHours(22, 0, 0, 0);
        
        // Check if this 12h shift contains this hour
        if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
          return getDriverDetails(shift.driverId);
        }
        
        // For night shifts (22:00 to 10:00 next day)
        const prevDay = addDays(day, -1);
        const prevDayShift = shifts.find(s => {
          const sDate = parseISO(s.date);
          return !s.isFullDay && isSameDay(sDate, prevDay);
        });
        
        if (prevDayShift) {
          const nightShiftStart = new Date(prevDay);
          nightShiftStart.setHours(22, 0, 0, 0);
          
          const nightShiftEnd = new Date(day);
          nightShiftEnd.setHours(10, 0, 0, 0);
          
          if (isWithinInterval(cellDateTime, { start: nightShiftStart, end: nightShiftEnd })) {
            return getDriverDetails(prevDayShift.driverId);
          }
        }
      }
    }
    
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Tabla de Horarios Semanal</CardTitle>
        <CardDescription>Vista detallada de todos los turnos por hora y día</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="border rounded-md">
          <Table>
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
            <TableBody>
              {weekDays.map(day => (
                <TableRow key={day.toString()}>
                  <TableCell className="font-medium">
                    {format(day, 'EEEE, d', { locale: es })}
                  </TableCell>
                  
                  {hours.map(hour => {
                    const driverInfo = getShiftForTimeSlot(day, hour);
                    
                    return (
                      <TableCell 
                        key={hour} 
                        className={`p-1 ${driverInfo ? `${driverInfo.color} text-white opacity-80` : ''}`}
                        title={driverInfo ? `Turno de ${driverInfo.name}` : ''}
                      >
                        <div className="w-full h-6 flex items-center justify-center">
                          {driverInfo && (hour === 12 || hour === 22 || hour === 10) && (
                            <span className="text-xs truncate max-w-[60px]">
                              {driverInfo.name}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {drivers.map(driver => (
            <div key={driver.id} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${driverColors[driver.id] || 'bg-gray-500'}`} />
              <span className="text-xs ml-1">{driver.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
