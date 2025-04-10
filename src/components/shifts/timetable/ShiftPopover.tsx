
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ShiftCreationForm } from './ShiftCreationForm';
import { ShiftDeleteForm } from './ShiftDeleteForm';
import { Driver } from '@/types';

interface ShiftPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCell: { day: Date; hour: number } | null;
  existingShift: { name: string; color: string; shiftId: string } | null;
  selectedDriver: string;
  setSelectedDriver: (id: string) => void;
  shiftType: string;
  setShiftType: (type: string) => void;
  drivers: Driver[];
  onAddShift: () => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftPopover({
  isOpen,
  onOpenChange,
  selectedCell,
  existingShift,
  selectedDriver,
  setSelectedDriver,
  shiftType,
  setShiftType,
  drivers,
  onAddShift,
  onDeleteShift,
}: ShiftPopoverProps) {
  if (!selectedCell) return null;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <Button className="hidden">Trigger</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        {existingShift ? (
          <ShiftDeleteForm 
            day={selectedCell.day} 
            hour={selectedCell.hour} 
            onDelete={onDeleteShift} 
            shiftId={existingShift.shiftId}
          />
        ) : (
          <ShiftCreationForm
            day={selectedCell.day}
            hour={selectedCell.hour}
            selectedDriver={selectedDriver}
            setSelectedDriver={setSelectedDriver}
            shiftType={shiftType}
            setShiftType={setShiftType}
            drivers={drivers}
            onSubmit={onAddShift}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
