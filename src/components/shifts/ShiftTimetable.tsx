
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Shift, Driver } from '@/types';
import { MoveHorizontalIcon, FileTextIcon } from 'lucide-react';
import { TimetableHeader } from './timetable/TimetableHeader';
import { TimetableBody } from './timetable/TimetableBody';
import { DriversLegend } from './timetable/DriversLegend';
import { ShiftPopover } from './timetable/ShiftPopover';
import { TimetableFilters } from './timetable/TimetableFilters';
import { useShiftTimetable } from '@/hooks/useShiftTimetable';
import { getShiftForTimeSlot } from './timetable/ShiftUtils';
import { Button } from '@/components/ui/button';
import { downloadCSV, prepareShiftsForExport } from '@/lib/exportUtils';
import { format } from 'date-fns';

interface ShiftTimetableProps {
  shifts: Shift[];
  drivers: Driver[];
  onAddShift: (shift: Omit<Shift, 'id'>) => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftTimetable({ shifts, drivers, onAddShift, onDeleteShift }: ShiftTimetableProps) {
  const {
    hours,
    weekDays,
    selectedCell,
    existingShift,
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
  } = useShiftTimetable(shifts, drivers, onAddShift, onDeleteShift);

  // Handle export of shifts to CSV
  const handleExportShifts = () => {
    const exportData = prepareShiftsForExport(shifts, drivers, startDate, endDate);
    
    if (exportData.length === 0) {
      // No shifts to export
      return;
    }
    
    // Format date range for filename
    const startDateFormatted = format(startDate, 'yyyyMMdd');
    const endDateFormatted = format(endDate, 'yyyyMMdd');
    const filename = `turnos_${startDateFormatted}_${endDateFormatted}.csv`;
    
    downloadCSV(exportData, filename);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <CardTitle>Planificador de Turnos</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <div>Asigna y visualiza los turnos semanales - Haz clic o arrastra para asignar un turno</div>
              <div className="flex items-center gap-1 text-xs bg-muted p-1 rounded">
                <MoveHorizontalIcon className="h-3 w-3" /> Arrastra para seleccionar varios turnos
              </div>
            </CardDescription>
          </div>
          <Button 
            className="mt-2 sm:mt-0" 
            variant="outline" 
            size="sm" 
            onClick={handleExportShifts}
          >
            <FileTextIcon className="mr-1 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
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
            <TimetableHeader hours={hours} />
            <TimetableBody 
              weekDays={weekDays}
              hours={hours}
              filteredShifts={filteredShifts}
              getDriverDetails={getDriverDetails}
              handleCellClick={handleCellClick}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              isDragging={isDragging}
              isInSelectionRange={isInSelectionRange}
              getShiftForTimeSlot={getShiftForTimeSlot}
            />
          </Table>
        </div>
        
        {/* Legend for driver colors */}
        <DriversLegend drivers={drivers} driverColors={driverColors} />
        
        {/* Popover for shift creation/deletion */}
        <ShiftPopover
          isOpen={!!selectedCell}
          onOpenChange={handleOpenChange}
          selectedCell={selectedCell}
          existingShift={existingShift}
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
