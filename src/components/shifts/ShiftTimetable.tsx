
import React, { useState, useMemo } from 'react';
import { format, addHours, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval, setHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shift, Driver } from '@/types';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ShiftTimetableProps {
  shifts: Shift[];
  drivers: Driver[];
  onAddShift: (shift: Omit<Shift, 'id'>) => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftTimetable({ shifts, drivers, onAddShift, onDeleteShift }: ShiftTimetableProps) {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<{day: Date, hour: number} | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [shiftType, setShiftType] = useState<string>('half');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{day: Date, hour: number} | null>(null);
  
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
          return { ...getDriverDetails(shift.driverId), shiftId: shift.id };
        }
      } else {
        // For 12h shifts (assuming 10:00 to 22:00)
        const shiftStart = new Date(shiftDate);
        shiftStart.setHours(10, 0, 0, 0);
        
        const shiftEnd = new Date(shiftDate);
        shiftEnd.setHours(22, 0, 0, 0);
        
        // Check if this 12h shift contains this hour
        if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
          return { ...getDriverDetails(shift.driverId), shiftId: shift.id };
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
            return { ...getDriverDetails(prevDayShift.driverId), shiftId: prevDayShift.id };
          }
        }
      }
    }
    
    return null;
  };

  // Handle cell click to select it
  const handleCellClick = (day: Date, hour: number) => {
    // Check if there's already a shift for this cell
    const existingShift = getShiftForTimeSlot(day, hour);
    
    if (existingShift) {
      // If shift exists, show delete button in the popover
      setSelectedCell({ day, hour });
    } else {
      // If no shift, show add form in the popover
      setSelectedCell({ day, hour });
      setSelectedDriver('');
      setShiftType('half');
    }
  };

  // Handle drag to create shifts
  const handleMouseDown = (day: Date, hour: number) => {
    // Start drag operation
    setIsDragging(true);
    setDragStart({ day, hour });
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart) {
      // End drag operation and open the popover
      setIsDragging(false);
      setSelectedCell(dragStart);
    }
  };

  const handleMouseOver = (day: Date, hour: number) => {
    if (isDragging) {
      // Visual feedback during drag could be added here
      // For now, we'll just use the drag start for the cell selection
    }
  };

  // Reset selection when popover closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCell(null);
    }
  };

  // Handle shift creation
  const handleAddShift = () => {
    if (selectedCell && selectedDriver) {
      onAddShift({
        date: selectedCell.day.toISOString().split('T')[0],
        driverId: selectedDriver,
        isFullDay: shiftType === 'full',
      });
      
      setSelectedCell(null);
      toast({
        title: "Turno creado",
        description: `Turno de ${shiftType === 'full' ? '24h' : '12h'} asignado correctamente.`,
      });
    }
  };

  // Handle shift deletion
  const handleDeleteShift = (shiftId: string) => {
    onDeleteShift(shiftId);
    setSelectedCell(null);
    toast({
      title: "Turno eliminado",
      description: "El turno ha sido eliminado correctamente.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Planificador de Turnos</CardTitle>
        <CardDescription>Asigna y visualiza los turnos semanales - Haz clic en una celda para asignar un turno</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="border rounded-md">
          <Table onMouseUp={handleMouseUp}>
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
                        className={`p-1 cursor-pointer relative ${
                          driverInfo 
                            ? `${driverInfo.color} text-white opacity-80 hover:opacity-100` 
                            : 'hover:bg-muted/50'
                        }`}
                        title={driverInfo ? `Turno de ${driverInfo.name}` : 'Haz clic para asignar un turno'}
                        onClick={() => handleCellClick(day, hour)}
                        onMouseDown={() => handleMouseDown(day, hour)}
                        onMouseOver={() => handleMouseOver(day, hour)}
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
        
        {/* Popover for shift creation/deletion */}
        {selectedCell && (
          <Popover open={!!selectedCell} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <div className="hidden">Trigger</div> {/* Hidden trigger, popover controlled programmatically */}
            </PopoverTrigger>
            <PopoverContent className="w-80" align="center">
              {getShiftForTimeSlot(selectedCell.day, selectedCell.hour) ? (
                // Shift exists - show delete option
                <div className="space-y-4">
                  <div className="text-sm font-medium">
                    Turno existente para {format(selectedCell.day, 'dd/MM/yyyy', { locale: es })} a las {selectedCell.hour}:00
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      const shiftInfo = getShiftForTimeSlot(selectedCell.day, selectedCell.hour);
                      if (shiftInfo && shiftInfo.shiftId) {
                        handleDeleteShift(shiftInfo.shiftId);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar turno
                  </Button>
                </div>
              ) : (
                // No shift - show creation form
                <div className="space-y-4">
                  <div className="text-sm font-medium">
                    Asignar turno para {format(selectedCell.day, 'dd/MM/yyyy', { locale: es })} a las {selectedCell.hour}:00
                  </div>
                  
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
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>Turno de 12 horas (10:00-22:00)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          <span>Turno de 24 horas</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleAddShift}
                    disabled={!selectedDriver}
                  >
                    Guardar Turno
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
    </Card>
  );
}
