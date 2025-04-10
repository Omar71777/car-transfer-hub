
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

interface ShiftDeleteFormProps {
  day: Date;
  hour: number;
  onDelete: (shiftId: string) => void;
  shiftId: string;
}

export function ShiftDeleteForm({ day, hour, onDelete, shiftId }: ShiftDeleteFormProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">
        Turno existente para {format(day, 'dd/MM/yyyy', { locale: es })} a las {hour}:00
      </div>
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={() => onDelete(shiftId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar turno
      </Button>
    </div>
  );
}
