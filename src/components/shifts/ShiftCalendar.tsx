
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shift, Driver } from '@/types';
import { isSameDay } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import { ShiftDialog } from './calendar/ShiftDialog';
import { ShiftDetails } from './calendar/ShiftDetails';
import { ShiftCalendarDay } from './calendar/ShiftCalendarDay';

interface ShiftCalendarProps {
  shifts: Shift[];
  drivers: Driver[];
  onAddShift: (shift: Omit<Shift, 'id'>) => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftCalendar({ shifts, drivers, onAddShift, onDeleteShift }: ShiftCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [shiftType, setShiftType] = useState<string>('half');

  // Find shift for a specific date
  const findShiftByDate = (date: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), date));
  };

  // Get driver name by ID
  const getDriverNameById = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    return driver ? driver.name : 'Desconocido';
  };

  // Handle shift form submission
  const handleSubmit = () => {
    if (date && selectedDriver) {
      onAddShift({
        date: date.toISOString().split('T')[0],
        driverId: selectedDriver,
        isFullDay: shiftType === 'full',
      });
      setDialogOpen(false);
      // Reset form after submit
      setSelectedDriver('');
      setShiftType('half');
    }
  };

  // Handle deleting a shift
  const handleDeleteShift = (date: Date) => {
    const shift = findShiftByDate(date);
    if (shift) {
      onDeleteShift(shift.id);
    }
  };

  // Get the selected shift's driver name
  const getSelectedShiftDriverName = () => {
    if (!date) return '';
    
    const shift = findShiftByDate(date);
    if (!shift) return '';
    
    return getDriverNameById(shift.driverId);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Calendario de Turnos</CardTitle>
        <CardDescription>Gestiona los turnos de los conductores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            className="w-full shine-effect bg-gradient-to-r from-primary to-accent text-white"
            onClick={() => setDialogOpen(true)}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Asignar Nuevo Turno
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-6 items-start">
          <div className="md:col-span-5 mb-6 md:mb-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => (
                  <ShiftCalendarDay 
                    date={date} 
                    shifts={shifts} 
                    getDriverNameById={getDriverNameById} 
                  />
                ),
              }}
            />
            
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--shift-12h))' }} />
                <span className="text-sm">Turno de 12 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--shift-24h))' }} />
                <span className="text-sm">Turno de 24 horas</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3">Detalles del Turno</h3>
              
              <ShiftDetails 
                date={date}
                shift={date ? findShiftByDate(date) : undefined}
                driverName={getSelectedShiftDriverName()}
                onDeleteShift={handleDeleteShift}
                onOpenDialog={() => setDialogOpen(true)}
              />
            </div>
          </div>
        </div>

        <ShiftDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          date={date}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          shiftType={shiftType}
          setShiftType={setShiftType}
          drivers={drivers}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
