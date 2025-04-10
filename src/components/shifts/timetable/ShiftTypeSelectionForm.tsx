
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock12Icon, Clock24Icon, CalendarIcon } from 'lucide-react';

interface ShiftTypeSelectionFormProps {
  day: Date;
  hour: number;
  onTypeSelect: (type: string) => void;
  setShowTypeSelection: (show: boolean) => void;
}

export function ShiftTypeSelectionForm({
  day,
  hour,
  onTypeSelect,
  setShowTypeSelection
}: ShiftTypeSelectionFormProps) {
  const formattedDate = format(day, 'EEEE, d MMMM', { locale: es });
  const formattedTime = `${hour}:00`;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg">Seleccionar tipo de turno</CardTitle>
        <CardDescription>
          {formattedDate} - {formattedTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onTypeSelect('half')}
        >
          <Clock12Icon className="mr-2 h-4 w-4" />
          <div className="flex flex-col items-start">
            <span>Turno de 12 horas</span>
            <span className="text-xs text-muted-foreground">Media jornada</span>
          </div>
        </Button>
        
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onTypeSelect('full')}
        >
          <Clock24Icon className="mr-2 h-4 w-4" />
          <div className="flex flex-col items-start">
            <span>Turno de 24 horas</span>
            <span className="text-xs text-muted-foreground">Jornada completa</span>
          </div>
        </Button>
        
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onTypeSelect('free')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <div className="flex flex-col items-start">
            <span>Día libre</span>
            <span className="text-xs text-muted-foreground">Todo el día libre</span>
          </div>
        </Button>
      </CardContent>
      <CardFooter className="p-0 pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => setShowTypeSelection(false)}
        >
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}
