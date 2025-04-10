
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

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
      return `${driverInfo.color} text-white opacity-80 hover:opacity-100 hover:ring-2 hover:ring-white/50 hover:ring-inset transition-all`;
    } else if (isInSelectionRange) {
      return 'bg-primary/30 hover:bg-primary/40';
    } else {
      return 'hover:bg-muted/50';
    }
  };

  // Get formatted date and time for tooltip
  const formattedDate = format(day, 'dd/MM/yyyy');
  const formattedTime = `${hour}:00`;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <TableCell 
            className={`p-1 cursor-pointer relative ${getCellClasses()} ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onClick={() => onClick(day, hour)}
            onMouseDown={() => onMouseDown(day, hour)}
            onMouseOver={() => onMouseOver(day, hour)}
          >
            <div className="w-full h-6 flex items-center justify-center">
              {driverInfo && (hour === 12 || hour === 22 || hour === 10 || hour === 0 || 
                (driverInfo.type === 'half' ? hour % 6 === 0 : hour % 8 === 0)
              ) && (
                <span className="text-xs truncate max-w-[60px]">
                  {driverInfo.name}
                </span>
              )}
            </div>
          </TableCell>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div>{formattedDate} - {formattedTime}</div>
            {driverInfo && (
              <div className="font-semibold">
                {driverInfo.name} - {driverInfo.type === 'half' ? 'Turno 12h' : 
                                     driverInfo.type === 'free' ? 'Día libre' : 'Turno 24h'}
              </div>
            )}
            {!driverInfo && 'Haz clic para asignar un turno'}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
