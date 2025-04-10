
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Driver } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Calendar, Clock12 } from 'lucide-react';

interface ShiftCreationFormProps {
  day: Date;
  hour: number;
  selectedDriver: string;
  setSelectedDriver: (id: string) => void;
  shiftType: string;
  setShiftType: (type: string) => void;
  drivers: Driver[];
  onSubmit: () => void;
}

export function ShiftCreationForm({
  day,
  hour,
  selectedDriver,
  setSelectedDriver,
  shiftType,
  setShiftType,
  drivers,
  onSubmit
}: ShiftCreationFormProps) {
  // Calculate the end hour for display
  const getEndHour = () => {
    if (shiftType === 'half') {
      return (hour + 12) % 24;
    } else {
      return hour; // For 24h shifts, end hour = start hour
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium space-y-1">
        <div>Asignar turno a partir de:</div>
        <div className="flex items-center gap-2 text-primary font-bold">
          <Calendar className="h-4 w-4" />
          {format(day, 'dd/MM/yyyy', { locale: es })}
          <Clock className="h-4 w-4 ml-2" />
          {hour}:00
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="driver">Conductor</Label>
        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
          <SelectTrigger className="w-full" id="driver">
            <SelectValue placeholder="Selecciona un conductor" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de Turno</Label>
        <RadioGroup value={shiftType} onValueChange={setShiftType} className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="half" id="half" />
            <Label htmlFor="half" className="flex items-center gap-2 cursor-pointer flex-1">
              <Clock12 className="h-4 w-4 text-blue-500" />
              <span>
                Turno de 12 horas 
                <span className="text-sm text-muted-foreground ml-1">
                  ({hour}:00 - {getEndHour()}:00)
                </span>
              </span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="full" id="full" />
            <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer flex-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>
                Turno de 24 horas 
                <span className="text-sm text-muted-foreground ml-1">
                  (día completo)
                </span>
              </span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="flex items-center gap-2 cursor-pointer flex-1">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>Día libre (24 horas)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button 
        className="w-full" 
        onClick={onSubmit}
        disabled={!selectedDriver}
      >
        Guardar Turno
      </Button>
    </div>
  );
}
