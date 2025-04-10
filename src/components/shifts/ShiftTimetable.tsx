
import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, isAfter, isBefore, isSameHour } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shift, Driver } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ShiftCell } from './timetable/ShiftCell';
import { DriversLegend } from './timetable/DriversLegend';
import { ShiftPopover } from './timetable/ShiftPopover';
import { getShiftForTimeSlot } from './timetable/ShiftUtils';
import { TimetableFilters } from './timetable/TimetableFilters';
import { MoveHorizontalIcon } from 'lucide-react';

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
  const [dragEnd, setDragEnd] = useState<{day: Date, hour: number} | null>(null);
  
  // Filter states
  const [filterDriver, setFilterDriver] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date>(() => endOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Generate hours for columns (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate days of the week based on selected date range
  const weekDays = useMemo(() => {
    const days = [];
    let currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    
    return days;
  }, [startDate, endDate]);

  // Filter shifts based on selected driver and date range
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const isInDateRange = shiftDate >= startDate && shiftDate <= endDate;
      
      if (!isInDateRange) return false;
      if (filterDriver && shift.driverId !== filterDriver) return false;
      
      return true;
    });
  }, [shifts, filterDriver, startDate, endDate]);

  // Helper to check if a cell is within the current drag selection
  const isInSelectionRange = (day: Date, hour: number) => {
    if (!dragStart || !dragEnd) return false;
    
    // If dragging on the same day
    if (isSameDay(dragStart.day, dragEnd.day) && isSameDay(day, dragStart.day)) {
      const minHour = Math.min(dragStart.hour, dragEnd.hour);
      const maxHour = Math.max(dragStart.hour, dragEnd.hour);
      return hour >= minHour && hour <= maxHour;
    }
    
    // If dragging across multiple days
    if (
      (isSameDay(day, dragStart.day) && hour >= dragStart.hour) ||
      (isSameDay(day, dragEnd.day) && hour <= dragEnd.hour) ||
      (isAfter(day, dragStart.day) && isBefore(day, dragEnd.day))
    ) {
      return true;
    }
    
    return false;
  };

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
    // If we just finished dragging, don't process the click
    if (isDragging) return;
    
    // Check if there's already a shift for this cell
    const existingShift = getShiftForTimeSlot(day, hour, filteredShifts, getDriverDetails);
    
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
    setDragEnd({ day, hour }); // Initialize drag end to the same cell
    
    // Add document-level event listeners
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      // End drag operation
      setIsDragging(false);
      
      // If dragging resulted in selecting a range of cells
      if (!isSameDay(dragStart.day, dragEnd.day) || dragStart.hour !== dragEnd.hour) {
        // For multi-cell selection, we'll determine whether to use the start or end time
        // based on which gives the most sensible shift:
        // - For shifts spanning multiple days, we'll set the day to the start day
        // - For shifts spanning hours, we'll set the hour range based on selection
        if (isSameDay(dragStart.day, dragEnd.day)) {
          // Same day, will select between these hours
          setSelectedCell(dragStart);
          
          // Automatically set the shift type based on the hour range
          const hourRange = Math.abs(dragEnd.hour - dragStart.hour);
          if (hourRange >= 12) {
            setShiftType('full');
          } else {
            setShiftType('half');
          }
        } else {
          // Multi-day selection, default to start day
          setSelectedCell(dragStart);
          setShiftType('full');
        }
        
        // Show a toast to guide the user
        toast({
          title: "Selección completada",
          description: "Ahora puedes configurar el turno para el periodo seleccionado.",
        });
      } else {
        // Single cell selection
        setSelectedCell(dragStart);
      }
    }
    
    // Remove document-level event listeners
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseOver = (day: Date, hour: number) => {
    if (isDragging) {
      // Update the end of the selection
      setDragEnd({ day, hour });
    }
  };

  // Add document-level mouse up handler to catch if user releases outside the table
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, dragEnd]);

  // Reset selection when popover closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCell(null);
      setDragStart(null);
      setDragEnd(null);
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
      setDragStart(null);
      setDragEnd(null);
      
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

  // Handle filter changes
  const handleDriverFilterChange = (driverId: string | null) => {
    setFilterDriver(driverId);
  };

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const resetFilters = () => {
    setFilterDriver(null);
    setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Planificador de Turnos</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <div>Asigna y visualiza los turnos semanales - Haz clic o arrastra para asignar un turno</div>
          <div className="flex items-center gap-1 text-xs bg-muted p-1 rounded">
            <MoveHorizontalIcon className="h-3 w-3" /> Arrastra para seleccionar varios turnos
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        {/* Add filter component */}
        <TimetableFilters
          drivers={drivers}
          selectedDriver={filterDriver}
          onDriverChange={handleDriverFilterChange}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          onResetFilters={resetFilters}
        />
        
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
                    const driverInfo = getShiftForTimeSlot(day, hour, filteredShifts, getDriverDetails);
                    
                    return (
                      <ShiftCell
                        key={hour}
                        day={day}
                        hour={hour}
                        driverInfo={driverInfo}
                        onClick={handleCellClick}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        isDragging={isDragging}
                        isInSelectionRange={isInSelectionRange(day, hour)}
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
            ? getShiftForTimeSlot(selectedCell.day, selectedCell.hour, filteredShifts, getDriverDetails) 
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
