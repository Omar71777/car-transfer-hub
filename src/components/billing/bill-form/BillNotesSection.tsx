
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface BillNotesSectionProps {
  form: UseFormReturn<any>;
}

export function BillNotesSection({ form }: BillNotesSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notas (opcional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Información adicional para la factura"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
