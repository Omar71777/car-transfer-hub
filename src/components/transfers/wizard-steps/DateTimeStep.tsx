
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateTimeStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function DateTimeStep({ clients, collaborators, formState }: DateTimeStepProps) {
  const { control, setValue, getValues } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(
    getValues('date') ? new Date(getValues('date')) : undefined
  );

  // Generate time options (15-minute intervals)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setValue('date', format(selectedDate, 'yyyy-MM-dd'), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CalendarIcon className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">¿Cuándo se realizará el transfer?</h2>
        <p className="text-muted-foreground mt-1">
          Selecciona la fecha y hora del servicio
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha del Transfer *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora (opcional)</FormLabel>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
