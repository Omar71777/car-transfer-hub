
import { useCallback } from 'react';
import { Shift } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getShiftForTimeSlot } from '@/components/shifts/timetable/ShiftUtils';

export function useShiftActions(
  shifts: Shift[], 
  onAddShift: (shift: Omit<Shift, 'id'>) => void, 
  onDeleteShift: (id: string) => void,
  getDriverDetails: (driverId: string) => { name: string; color: string }
) {
  const { toast } = useToast();

  // Handle cell click to select it
  const handleCellClick = useCallback((
    day: Date, 
    hour: number, 
    isDragging: boolean, 
    setSelectedCell: (cell: {day: Date, hour: number} | null) => void,
    setSelectedDriver: (driverId: string) => void,
    setShiftType: (type: string) => void,
    filteredShifts: Shift[],
    setShowTypeSelection: (show: boolean) => void
  ) => {
    // If we just finished dragging, don't process the click
    if (isDragging) return;
    
    // Check if there's already a shift for this cell
    const existingShift = getShiftForTimeSlot(day, hour, filteredShifts, getDriverDetails);
    
    // Always set the selected cell
    setSelectedCell({ day, hour });
    
    if (!existingShift) {
      // Si no hay un turno existente, prepare para agregar uno nuevo
      // Vamos directamente al formulario de creación, sin selección de tipo
      setSelectedDriver('');
      setShiftType('full'); // Por defecto asignamos turno completo
      setShowTypeSelection(false);
    }
  }, [getDriverDetails]);

  // Handle shift type selection (mantenemos por compatibilidad)
  const handleShiftTypeSelect = useCallback((
    type: string,
    setShiftType: (type: string) => void,
    setShowTypeSelection: (show: boolean) => void
  ) => {
    setShiftType(type);
    setShowTypeSelection(false);
  }, []);

  // Handle shift creation
  const handleAddShift = useCallback((
    selectedCell: {day: Date, hour: number} | null,
    selectedDriver: string,
    shiftType: string,
    setSelectedCell: (cell: {day: Date, hour: number} | null) => void,
    setDragStart: (cell: {day: Date, hour: number} | null) => void,
    setDragEnd: (cell: {day: Date, hour: number} | null) => void
  ) => {
    if (selectedCell && selectedDriver) {
      const shiftTypeLabel = shiftType === 'half' ? '12h' : 
                            shiftType === 'full' ? '24h' : 'día libre';
      
      onAddShift({
        date: selectedCell.day.toISOString().split('T')[0],
        driverId: selectedDriver,
        isFullDay: shiftType === 'full' || shiftType === 'free',
        isFreeDay: shiftType === 'free'
      });
      
      setSelectedCell(null);
      setDragStart(null);
      setDragEnd(null);
      
      toast({
        title: "Turno creado",
        description: `Turno de ${shiftTypeLabel} asignado correctamente.`,
      });
    }
  }, [onAddShift, toast]);

  // Handle shift deletion
  const handleDeleteShift = useCallback((
    shiftId: string,
    setSelectedCell: (cell: {day: Date, hour: number} | null) => void
  ) => {
    onDeleteShift(shiftId);
    setSelectedCell(null);
    toast({
      title: "Turno eliminado",
      description: "El turno ha sido eliminado correctamente.",
    });
  }, [onDeleteShift, toast]);

  return {
    handleCellClick,
    handleShiftTypeSelect,
    handleAddShift,
    handleDeleteShift,
  };
}
