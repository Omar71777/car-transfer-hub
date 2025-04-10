
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Driver } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check } from 'lucide-react';

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | undefined;
  selectedDriver: string;
  setSelectedDriver: (value: string) => void;
  shiftType: string;
  setShiftType: (value: string) => void;
  drivers: Driver[];
  onSubmit: () => void;
}

export function ShiftDialog({
  open,
  onOpenChange,
  date,
  selectedDriver,
  setSelectedDriver,
  shiftType,
  setShiftType,
  drivers,
  onSubmit
}: ShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Nuevo Turno</DialogTitle>
          <DialogDescription>
            Selecciona un conductor y tipo de turno para la fecha: {date ? format(date, 'dd/MM/yyyy', { locale: es }) : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--shift-12h))' }} />
                  <span>Turno de 12 horas</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--shift-24h))' }} />
                  <span>Turno de 24 horas</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSubmit} disabled={!selectedDriver}>
            <Check className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
