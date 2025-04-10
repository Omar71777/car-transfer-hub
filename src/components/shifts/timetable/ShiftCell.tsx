
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { getShiftStyle } from './ShiftUtils';

interface ShiftCellProps {
  day: Date;
  hour: number;
  driverInfo: {
    name: string;
    color: string;
    shiftId: string;
    type?: 'half' | 'full' | 'free';
  } | null;
  onClick: (day: Date, hour: number) => void;
  onMouseDown: (day: Date, hour: number) => void;
  onMouseOver: (day: Date, hour: number) => void;
  isDragging: boolean;
  isInSelectionRange: boolean;
}

export function ShiftCell({ 
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
      return `${shiftStyleClass} text-white ring-offset-background ring-offset-1 hover:opacity-100 hover:ring-2 hover:ring-primary/50 hover:ring-inset transition-all`;
    } else if (isInSelectionRange) {
      return 'bg-primary/20 hover:bg-primary/30 transition-colors';
    } else {
      return 'hover:bg-muted/50 transition-colors';
    }
  };

  // Get formatted date and time for tooltip
  const formattedDate = format(day, 'dd/MM/yyyy');
  const formattedTime = `${hour}:00`;

  // In vertical layout, show driver names more frequently but still avoid cluttering
  const shouldShowDriverName = () => {
    if (!driverInfo) return false;
    
    if (driverInfo.type === 'half') {
      // For 12h shifts, show name every 3 hours
      return hour % 3 === 0;
    } else {
      // For 24h and free days, show name every 4 hours
      return hour % 4 === 0;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <TableCell 
            className={`p-0.5 sm:p-1 cursor-pointer relative ${getCellClasses()} ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onClick={() => onClick(day, hour)}
            onMouseDown={() => onMouseDown(day, hour)}
            onMouseOver={() => onMouseOver(day, hour)}
          >
            <div className="w-full h-7 flex items-center justify-center">
              {driverInfo && shouldShowDriverName() && (
                <span className="text-xs font-medium truncate max-w-[60px] px-0.5">
                  {driverInfo.name}
                </span>
              )}
            </div>
          </TableCell>
        </TooltipTrigger>
        <TooltipContent className="z-50 bg-popover/95 backdrop-blur-sm">
          <div className="text-xs space-y-1">
            <div className="font-medium">{formattedDate} - {formattedTime}</div>
            {driverInfo && (
              <div className="font-semibold">
                {driverInfo.name} - {driverInfo.type === 'half' ? 'Turno 12h' : 
                                    driverInfo.type === 'free' ? 'Día libre' : 'Turno 24h'}
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
