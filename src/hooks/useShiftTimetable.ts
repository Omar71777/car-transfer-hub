
import { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfWeek, endOfWeek, addDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { Shift, Driver } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getShiftForTimeSlot } from '@/components/shifts/timetable/ShiftUtils';

export function useShiftTimetable(shifts: Shift[], drivers: Driver[], onAddShift: (shift: Omit<Shift, 'id'>) => void, onDeleteShift: (id: string) => void) {
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
  const isInSelectionRange = useCallback((day: Date, hour: number) => {
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
  }, [dragStart, dragEnd]);

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
  const getDriverDetails = useCallback((driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return {
      name: driver ? driver.name : 'Desconocido',
      color: driverColors[driverId] || 'bg-gray-500'
    };
  }, [drivers, driverColors]);

  // Handle cell click to select it
  const handleCellClick = useCallback((day: Date, hour: number) => {
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
  }, [isDragging, filteredShifts, getDriverDetails]);

  // Handle drag to create shifts
  const handleMouseDown = useCallback((day: Date, hour: number) => {
    // Start drag operation
    setIsDragging(true);
    setDragStart({ day, hour });
    setDragEnd({ day, hour }); // Initialize drag end to the same cell
  }, []);

  const handleMouseUp = useCallback(() => {
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
  }, [isDragging, dragStart, dragEnd, toast]);

  const handleMouseOver = useCallback((day: Date, hour: number) => {
    if (isDragging) {
      // Update the end of the selection
      setDragEnd({ day, hour });
    }
  }, [isDragging]);

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
  }, [isDragging, handleMouseUp]);

  // Reset selection when popover closes
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedCell(null);
      setDragStart(null);
      setDragEnd(null);
    }
  }, []);

  // Handle shift creation
  const handleAddShift = useCallback(() => {
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
  }, [selectedCell, selectedDriver, shiftType, onAddShift, toast]);

  // Handle shift deletion
  const handleDeleteShift = useCallback((shiftId: string) => {
    onDeleteShift(shiftId);
    setSelectedCell(null);
    toast({
      title: "Turno eliminado",
      description: "El turno ha sido eliminado correctamente.",
    });
  }, [onDeleteShift, toast]);

  // Handle filter changes
  const handleDriverFilterChange = useCallback((driverId: string | null) => {
    setFilterDriver(driverId);
  }, []);

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterDriver(null);
    setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  return {
    hours,
    weekDays,
    selectedCell,
    existingShift: selectedCell 
      ? getShiftForTimeSlot(selectedCell.day, selectedCell.hour, filteredShifts, getDriverDetails) 
      : null,
    selectedDriver,
    setSelectedDriver,
    shiftType,
    setShiftType,
    isDragging,
    filteredShifts,
    driverColors,
    filterDriver,
    startDate,
    endDate,
    handleCellClick,
    handleMouseDown,
    handleMouseOver,
    handleOpenChange,
    handleAddShift,
    handleDeleteShift,
    handleDriverFilterChange,
    handleDateRangeChange,
    resetFilters,
    isInSelectionRange,
    getDriverDetails
  };
}
