
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
import { CalendarClock, Check, Clock, User } from 'lucide-react';

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
  const renderDay = (date: Date) => {
    const shift = findShiftByDate(date);
    if (!shift) return null;

    const driverName = getDriverNameById(shift.driverId);
    const shortName = driverName.split(' ')[0]; // Get first name only for display
    
    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {shift.isFullDay ? (
          <div className="absolute inset-0 bg-primary/20 rounded-md border border-primary/30">
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] px-1 py-0.5 rounded-t-md text-center font-medium truncate">
              {shortName}
            </div>
            <div className="absolute bottom-0 right-0 p-0.5">
              <Clock className="h-2.5 w-2.5 text-primary" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-secondary/20 rounded-md border border-secondary/30">
            <div className="absolute top-0 left-0 right-0 bg-secondary text-white text-[10px] px-1 py-0.5 rounded-t-md text-center font-medium truncate">
              {shortName}
            </div>
            <div className="absolute bottom-0 right-0 p-0.5">
              <Clock className="h-2.5 w-2.5 text-secondary" />
            </div>
          </div>
        )}
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
      // Reset form after submit
      setSelectedDriver('');
      setShiftType('half');
    }
  };

  const handleDeleteShift = (date: Date) => {
    const shift = findShiftByDate(date);
    if (shift) {
      onDeleteShift(shift.id);
    }
  };

  const getSelectedShiftInfo = () => {
    if (!date) return null;
    
    const shift = findShiftByDate(date);
    if (!shift) return null;
    
    const driverName = getDriverNameById(shift.driverId);
    
    return (
      <Card className={`mt-4 border ${shift.isFullDay ? 'border-primary/50 bg-primary/5' : 'border-secondary/50 bg-secondary/5'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{driverName}</span>
              </h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{shift.isFullDay ? 'Turno de 24 horas' : 'Turno de 12 horas'}</span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <CalendarClock className="h-3.5 w-3.5" />
                <span>{format(date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
              </p>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeleteShift(date)}
              className="h-8"
            >
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
              <Button className="w-full shine-effect">
                <CalendarClock className="mr-2 h-4 w-4" />
                Asignar Nuevo Turno
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                    <SelectTrigger className="w-full" id="driver">
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
                  <RadioGroup value={shiftType} onValueChange={setShiftType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                      <RadioGroupItem value="half" id="half" />
                      <Label htmlFor="half" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span>Turno de 12 horas</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span>Turno de 24 horas</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={!selectedDriver}>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-6 items-start">
          <div className="md:col-span-5 mb-6 md:mb-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => renderDay(date),
              }}
            />
            
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-sm">Turno de 12 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Turno de 24 horas</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3">Detalles del Turno</h3>
              
              {date && findShiftByDate(date) ? (
                getSelectedShiftInfo()
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center justify-center min-h-[150px] text-center">
                    <CalendarClock className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {date 
                        ? 'No hay turno asignado para esta fecha'
                        : 'Selecciona una fecha en el calendario'}
                    </p>
                    
                    {date && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setDialogOpen(true)}
                      >
                        Asignar Turno
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
