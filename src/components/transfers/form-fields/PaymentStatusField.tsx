
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethodIcon } from '../PaymentMethodIcon';

export function PaymentStatusField() {
  const { control, watch } = useFormContext();
  const paymentStatus = watch('paymentStatus');
  
  return (
    <>
      <FormField
        control={control}
        name="paymentStatus"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Estado de Pago *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                value={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Cobrado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pendiente de Pago</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {paymentStatus === 'paid' && (
        <FormField
          control={control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon method="card" className="h-4 w-4" />
                      <span>Tarjeta</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon method="cash" className="h-4 w-4" />
                      <span>Efectivo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon method="bank_transfer" className="h-4 w-4" />
                      <span>Transferencia</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
