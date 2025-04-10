
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BillEditFormValues } from './BillEditForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface BillDetailsSectionProps {
  form: UseFormReturn<BillEditFormValues>;
}

export function BillDetailsSection({ form }: BillDetailsSectionProps) {
  const isMobile = useIsMobile();
  
  return (
    <>
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de factura</FormLabel>
            <FormControl>
              <Input {...field} className={isMobile ? "mobile-input" : ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className={`grid gap-4 ${isMobile ? "" : "md:grid-cols-2"}`}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de emisión</FormLabel>
              <FormControl>
                <Input type="date" {...field} className={isMobile ? "mobile-input" : ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de vencimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} className={isMobile ? "mobile-input" : ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
