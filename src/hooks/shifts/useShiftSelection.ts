
import { useState, useCallback, useEffect } from 'react';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function useShiftSelection() {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<{day: Date, hour: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{day: Date, hour: number} | null>(null);
  const [dragEnd, setDragEnd] = useState<{day: Date, hour: number} | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [shiftType, setShiftType] = useState<string>('half');

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

  return {
    selectedCell,
    setSelectedCell,
    isDragging,
    isInSelectionRange,
    selectedDriver,
    setSelectedDriver,
    shiftType,
    setShiftType,
    handleMouseDown,
    handleMouseOver,
    handleOpenChange
  };
}
