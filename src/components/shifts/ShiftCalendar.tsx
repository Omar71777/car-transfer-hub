
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shift, Driver } from '@/types';
import { addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

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

  // Función para encontrar el turno en una fecha específica
  const findShiftByDate = (date: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), date));
  };

  // Función para encontrar el nombre del conductor por ID
  const getDriverNameById = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    return driver ? driver.name : 'Desconocido';
  };

  // Función para renderizar el contenido del día en el calendario
  const renderDay = (day: Date) => {
    const shift = findShiftByDate(day);
    if (!shift) return null;

    const driverName = getDriverNameById(shift.driverId);
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className={`text-xs text-center rounded-sm px-1 w-full ${shift.isFullDay ? 'bg-ibiza-500 text-white' : 'bg-ibiza-200 text-ibiza-900'}`}>
          {driverName}
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    if (date && selectedDriver) {
      onAddShift({
        date: format(date, 'yyyy-MM-dd'),
        driverId: selectedDriver,
        isFullDay: shiftType === 'full',
      });
      setDialogOpen(false);
    }
  };

  const handleDeleteShift = (date: Date) => {
    const shift = findShiftByDate(date);
    if (shift) {
      onDeleteShift(shift.id);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Calendario de Turnos</CardTitle>
        <CardDescription>Gestiona los turnos de los conductores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Asignar Nuevo Turno</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Nuevo Turno</DialogTitle>
                <DialogDescription>
                  Selecciona un conductor y tipo de turno para la fecha: {date ? format(date, 'dd/MM/yyyy', { locale: es }) : ''}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="driver">Conductor</Label>
                  <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un conductor" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Turno</Label>
                  <RadioGroup value={shiftType} onValueChange={setShiftType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="half" id="half" />
                      <Label htmlFor="half">Turno de 12 horas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full">Turno de 24 horas</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: ({ day }) => renderDay(day),
          }}
          footer={
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-ibiza-200" />
                <span>Turno de 12 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-ibiza-500" />
                <span>Turno de 24 horas</span>
              </div>
            </div>
          }
        />

        {date && findShiftByDate(date) && (
          <div className="mt-4">
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteShift(date)}
              className="w-full"
            >
              Eliminar Turno
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
