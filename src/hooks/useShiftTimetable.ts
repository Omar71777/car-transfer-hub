
import { useState } from 'react';
import { Shift, Driver } from '@/types';
import { useShiftSelection } from './shifts/useShiftSelection';
import { useShiftFilters } from './shifts/useShiftFilters';
import { useShiftActions } from './shifts/useShiftActions';
import { useShiftColors } from './shifts/useShiftColors';
import { getShiftForTimeSlot } from '@/components/shifts/timetable/ShiftUtils';

export function useShiftTimetable(
  shifts: Shift[], 
  drivers: Driver[], 
  onAddShift: (shift: Omit<Shift, 'id'>) => void, 
  onDeleteShift: (id: string) => void
) {
  // Generate hours for columns (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // State for shift type selection
  const [showTypeSelection, setShowTypeSelection] = useState<boolean>(false);
  
  // Compose all the hooks
  const { driverColors, getDriverDetails } = useShiftColors(drivers);
  
  const {
    filterDriver,
    startDate,
    endDate,
    weekDays,
    filteredShifts,
    handleDriverFilterChange,
    handleDateRangeChange,
    resetFilters
  } = useShiftFilters(shifts);

  const {
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
  } = useShiftSelection();

  const {
    handleCellClick: cellClickHandler,
    handleShiftTypeSelect: shiftTypeSelectHandler,
    handleAddShift: addShiftHandler,
    handleDeleteShift: deleteShiftHandler
  } = useShiftActions(shifts, onAddShift, onDeleteShift, getDriverDetails);

  // Create the handler functions that compose the individual hook handlers
  const handleCellClick = (day: Date, hour: number) => {
    cellClickHandler(
      day, 
      hour, 
      isDragging, 
      setSelectedCell, 
      setSelectedDriver, 
      setShiftType, 
      filteredShifts,
      setShowTypeSelection
    );
  };

  const handleShiftTypeSelect = (type: string) => {
    shiftTypeSelectHandler(
      type,
      setShiftType,
      setShowTypeSelection
    );
  };

  const handleAddShift = () => {
    addShiftHandler(
      selectedCell,
      selectedDriver,
      shiftType,
      setSelectedCell,
      (val) => {/* Empty function for drag start */}, 
      (val) => {/* Empty function for drag end */}
    );
  };

  const handleDeleteShift = (shiftId: string) => {
    deleteShiftHandler(shiftId, setSelectedCell);
  };

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
    showTypeSelection,
    setShowTypeSelection,
    handleCellClick,
    handleMouseDown,
    handleMouseOver,
    handleOpenChange,
    handleShiftTypeSelect,
    handleAddShift,
    handleDeleteShift,
    handleDriverFilterChange,
    handleDateRangeChange,
    resetFilters,
    isInSelectionRange,
    getDriverDetails
  };
}
