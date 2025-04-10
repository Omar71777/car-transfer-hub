
import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Shift, Driver } from '@/types';
import { MoveHorizontalIcon, FileTextIcon, InfoIcon } from 'lucide-react';
import { TimetableHeader } from './timetable/TimetableHeader';
import { TimetableBody } from './timetable/TimetableBody';
import { DriversLegend } from './timetable/DriversLegend';
import { ShiftPopover } from './timetable/ShiftPopover';
import { TimetableFilters } from './timetable/TimetableFilters';
import { useShiftTimetable } from '@/hooks/useShiftTimetable';
import { getShiftForTimeSlot } from './timetable/ShiftUtils';
import { Button } from '@/components/ui/button';
import { downloadCSV, prepareShiftsForExport } from '@/lib/exports';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  } = useShiftTimetable(shifts, drivers, onAddShift, onDeleteShift);

  // Memoized export handler to avoid unnecessary re-renders
  const handleExportShifts = useCallback(() => {
    const exportData = prepareShiftsForExport(shifts, drivers, startDate, endDate);
    
    if (exportData.length === 0) {
      return;
    }
    
    const startDateFormatted = format(startDate, 'yyyyMMdd');
    const endDateFormatted = format(endDate, 'yyyyMMdd');
    const filename = `turnos_${startDateFormatted}_${endDateFormatted}.csv`;
    
    downloadCSV(exportData, filename);
  }, [shifts, drivers, startDate, endDate]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              Planificador de Turnos
              <Badge variant="outline" className="ml-2 bg-primary/10">
                Vista Horizontal
              </Badge>
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1 text-sm mt-1">
                Haz clic o arrastra para asignar un turno - Mostrando días como columnas y horas como filas
              </div>
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 h-8"
                    onClick={handleExportShifts}
                  >
                    <FileTextIcon className="h-3.5 w-3.5" /> 
                    <span className="hidden sm:inline">Exportar</span> CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Exportar turnos a archivo CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1 h-8"
                  >
                    <InfoIcon className="h-3.5 w-3.5" /> 
                    <span className="hidden sm:inline">Ayuda</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <div className="space-y-2 text-xs">
                    <p className="font-medium">Consejos rápidos:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-1">
                        <MoveHorizontalIcon className="h-3 w-3" /> Arrastra para seleccionar varios turnos
                      </li>
                      <li>• Haz clic en un turno existente para eliminarlo</li>
                      <li>• Usa los filtros para ver turnos específicos</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        <TimetableFilters
          drivers={drivers}
          selectedDriver={filterDriver}
          onDriverChange={handleDriverFilterChange}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          onResetFilters={resetFilters}
        />
        
        <div className="border rounded-md mt-4 overflow-auto timetable-scroll max-h-[calc(100vh-320px)]">
          <Table>
            <TimetableHeader hours={hours} weekDays={weekDays} />
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
        
        <DriversLegend drivers={drivers} driverColors={driverColors} />
        
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
          showTypeSelection={showTypeSelection}
          setShowTypeSelection={setShowTypeSelection}
          onShiftTypeSelect={handleShiftTypeSelect}
        />
      </CardContent>
    </Card>
  );
}
