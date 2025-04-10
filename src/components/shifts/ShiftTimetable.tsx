
import React, { useMemo } from 'react';
import { format, addHours, startOfWeek, addDays, isSameDay, isWithinInterval, parseISO } from 'date-fns';
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
      'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500'
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

  // Function to determine if a cell should be colored
  const getCellContent = (day: Date, hour: number) => {
    const currentHourDate = addHours(new Date(day), hour);
    
    // Check shifts that might include this time
    for (const shift of shifts) {
      const shiftDate = parseISO(shift.date);
      
      if (shift.isFullDay) {
        // For 24h shifts, check if the day matches
        if (isSameDay(shiftDate, day)) {
          const driver = getDriverDetails(shift.driverId);
          return { 
            color: driver.color, 
            opacity: 'opacity-70',
            name: driver.name 
          };
        }
      } else {
        // For 12h shifts, we'll assume they start at 8AM and end at 8PM
        const shiftStart = new Date(shiftDate);
        shiftStart.setHours(8, 0, 0, 0);
        
        const shiftEnd = new Date(shiftDate);
        shiftEnd.setHours(20, 0, 0, 0);
        
        // Check if the current hour is within the shift time
        if (isSameDay(shiftDate, day) && hour >= 8 && hour < 20) {
          const driver = getDriverDetails(shift.driverId);
          return { 
            color: driver.color, 
            opacity: 'opacity-70',
            name: driver.name 
          };
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
                    const cellContent = getCellContent(day, hour);
                    
                    return (
                      <TableCell 
                        key={hour} 
                        className={`p-1 ${cellContent ? `${cellContent.color} ${cellContent.opacity} text-white` : ''}`}
                        title={cellContent ? `Turno de ${cellContent.name}` : ''}
                      >
                        <div className="w-full h-6 flex items-center justify-center">
                          {cellContent && hour === 12 && (
                            <span className="text-xs truncate max-w-[60px]">
                              {cellContent.name}
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
