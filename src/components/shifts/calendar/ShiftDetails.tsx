
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shift, Driver } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Clock, CalendarIcon, CalendarClock } from 'lucide-react';

interface ShiftDetailsProps {
  date: Date | undefined;
  shift: Shift | undefined;
  driverName: string;
  onDeleteShift: (date: Date) => void;
  onOpenDialog: () => void;
}

export function ShiftDetails({ 
  date, 
  shift, 
  driverName, 
  onDeleteShift, 
  onOpenDialog 
}: ShiftDetailsProps) {
  if (!date) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[150px] text-center">
          <CalendarClock className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Selecciona una fecha en el calendario
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!shift) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[150px] text-center">
          <CalendarClock className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay turno asignado para esta fecha
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onOpenDialog}
          >
            Asignar Turno
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border ${shift.isFullDay 
      ? 'border-[hsl(var(--shift-24h))]' 
      : 'border-[hsl(var(--shift-12h))]'}`}
      style={{ 
        backgroundColor: shift.isFullDay 
          ? 'hsl(var(--shift-24h-light))' 
          : 'hsl(var(--shift-12h-light))' 
      }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{driverName}</span>
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{shift.isFullDay ? 'Turno de 24 horas' : 'Turno de 12 horas'}</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDeleteShift(date)}
            className="h-8"
          >
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
