
import React, { useState, useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shift, Driver } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ShiftCell } from './timetable/ShiftCell';
import { DriversLegend } from './timetable/DriversLegend';
import { ShiftPopover } from './timetable/ShiftPopover';
import { getShiftForTimeSlot } from './timetable/ShiftUtils';

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

  // Handle cell click to select it
  const handleCellClick = (day: Date, hour: number) => {
    // Check if there's already a shift for this cell
    const existingShift = getShiftForTimeSlot(day, hour, shifts, getDriverDetails);
    
    // Always set the selected cell
    setSelectedCell({ day, hour });
    
    if (!existingShift) {
      // If no shift, prepare for adding a new one
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
                    const driverInfo = getShiftForTimeSlot(day, hour, shifts, getDriverDetails);
                    
                    return (
                      <ShiftCell
                        key={hour}
                        day={day}
                        hour={hour}
                        driverInfo={driverInfo}
                        onClick={handleCellClick}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend for driver colors */}
        <DriversLegend drivers={drivers} driverColors={driverColors} />
        
        {/* Popover for shift creation/deletion */}
        <ShiftPopover
          isOpen={!!selectedCell}
          onOpenChange={handleOpenChange}
          selectedCell={selectedCell}
          existingShift={selectedCell 
            ? getShiftForTimeSlot(selectedCell.day, selectedCell.hour, shifts, getDriverDetails) 
            : null}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          shiftType={shiftType}
          setShiftType={setShiftType}
          drivers={drivers}
          onAddShift={handleAddShift}
          onDeleteShift={handleDeleteShift}
        />
      </CardContent>
    </Card>
  );
}
