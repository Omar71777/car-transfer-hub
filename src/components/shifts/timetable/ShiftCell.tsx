
import React, { memo } from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { getShiftColorVar, getShiftStyle, getShiftTypeLabel } from './ShiftUtils';

interface ShiftCellProps {
  day: Date;
  hour: number;
  driverInfo: {
    name: string;
    color: string;
    shiftId: string;
    type?: 'half' | 'full' | 'free';
    startHour?: number;
    endHour?: number;
  } | null;
  onClick: (day: Date, hour: number) => void;
  onMouseDown: (day: Date, hour: number) => void;
  onMouseOver: (day: Date, hour: number) => void;
  isDragging: boolean;
  isInSelectionRange: boolean;
}

function ShiftCellComponent({ 
  day, 
  hour, 
  driverInfo, 
  onClick, 
  onMouseDown, 
  onMouseOver,
  isDragging,
  isInSelectionRange
}: ShiftCellProps) {
  // Determine cell styling based on state
  const getCellClasses = () => {
    if (driverInfo) {
      const shiftStyleClass = driverInfo.type ? getShiftStyle(driverInfo.type) : '';
      // Add visual indicator for shift boundary hours (start and end hours)
      const isShiftBoundary = driverInfo.startHour === hour || 
                             (driverInfo.endHour && driverInfo.endHour % 24 === hour);
      
      // For horizontal layout, we highlight boundaries differently - use border-t for start and border-b for end
      const boundaryClass = isShiftBoundary 
        ? (driverInfo.startHour === hour ? 'border-t-2 border-t-primary/70' : 'border-b-2 border-b-primary/70')
        : '';
      
      return `${shiftStyleClass} ${boundaryClass} text-white ring-offset-background ring-offset-1 hover:opacity-100 hover:ring-2 hover:ring-primary/50 hover:ring-inset transition-all`;
    } else if (isInSelectionRange) {
      return 'bg-primary/20 hover:bg-primary/30 transition-colors animate-pulse';
    } else {
      return 'hover:bg-muted/50 transition-colors';
    }
  };

  // Get formatted date and time for tooltip
  const formattedDate = format(day, 'dd/MM/yyyy');
  const formattedTime = `${hour.toString().padStart(2, '0')}:00`;

  // In horizontal layout, we always show the driver name if there's a shift
  const shouldShowDriverName = () => {
    return !!driverInfo;
  };

  // Create formatted time range for the tooltip
  const getTimeRange = () => {
    if (!driverInfo || !driverInfo.startHour) return formattedTime;
    
    const start = `${driverInfo.startHour.toString().padStart(2, '0')}:00`;
    const end = driverInfo.endHour 
      ? `${(driverInfo.endHour % 24).toString().padStart(2, '0')}:00` 
      : `${((driverInfo.startHour + 12) % 24).toString().padStart(2, '0')}:00`;
    
    return `${start} - ${end}`;
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <TableCell 
            className={`p-0.5 sm:p-1 cursor-pointer relative timetable-cell ${getCellClasses()} ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onClick={() => onClick(day, hour)}
            onMouseDown={() => onMouseDown(day, hour)}
            onMouseOver={() => onMouseOver(day, hour)}
            aria-label={`Celda para ${formattedDate} a las ${formattedTime}`}
          >
            <div className="w-full h-7 flex items-center justify-center">
              {driverInfo && shouldShowDriverName() && (
                <span className="text-xs font-medium truncate max-w-[80px] px-0.5">
                  {driverInfo.name}
                </span>
              )}
            </div>
          </TableCell>
        </TooltipTrigger>
        <TooltipContent className="z-50 bg-popover/95 backdrop-blur-sm">
          <div className="text-xs space-y-1">
            <div className="font-medium">{formattedDate} - {getTimeRange()}</div>
            {driverInfo && (
              <div className="space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${getShiftColorVar(driverInfo.type || 'half')}`}></span>
                  {driverInfo.name} - {driverInfo.type ? getShiftTypeLabel(driverInfo.type) : 'Turno'}
                </div>
              </div>
            )}
            {!driverInfo && (
              <div className="text-muted-foreground">Haz clic para asignar un turno</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Memoize the component to avoid unnecessary re-renders
export const ShiftCell = memo(ShiftCellComponent);
