
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Driver } from '@/types';

interface ShiftCellProps {
  day: Date;
  hour: number;
  driverInfo: {
    name: string;
    color: string;
    shiftId: string;
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
      return `${driverInfo.color} text-white opacity-80 hover:opacity-100`;
    } else if (isInSelectionRange) {
      return 'bg-primary/30 hover:bg-primary/40';
    } else {
      return 'hover:bg-muted/50';
    }
  };

  return (
    <TableCell 
      className={`p-1 cursor-pointer relative ${getCellClasses()} ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      title={driverInfo ? `Turno de ${driverInfo.name}` : 'Haz clic para asignar un turno'}
      onClick={() => onClick(day, hour)}
      onMouseDown={() => onMouseDown(day, hour)}
      onMouseOver={() => onMouseOver(day, hour)}
    >
      <div className="w-full h-6 flex items-center justify-center">
        {driverInfo && (hour === 12 || hour === 22 || hour === 10) && (
          <span className="text-xs truncate max-w-[60px]">
            {driverInfo.name}
          </span>
        )}
      </div>
    </TableCell>
  );
}
