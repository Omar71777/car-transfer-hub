
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PricingFieldsProps {
  form: UseFormReturn<TransferFormValues>;
}

export function PricingFields({
  form
}: PricingFieldsProps) {
  const commissionType = form.watch('commissionType');
  const price = form.watch('price');
  const commission = form.watch('commission');
  
  // Calculate the equivalent fixed amount or percentage when values change
  useEffect(() => {
    if (!price || !commission) return;
    
    const priceNum = Number(price);
    const commissionNum = Number(commission);
    
    // Don't update if we don't have valid numbers
    if (isNaN(priceNum) || isNaN(commissionNum) || priceNum <= 0) return;
    
    // We don't need to update anything since both values will be saved
    // This is just for display purposes
  }, [price, commission, commissionType]);
  
  // Calculate the equivalent value based on the opposite commission type
  const getEquivalentValue = () => {
    if (!price || !commission) return null;
    
    const priceNum = Number(price);
    const commissionNum = Number(commission);
    
    if (isNaN(priceNum) || isNaN(commissionNum) || priceNum <= 0) return null;
    
    if (commissionType === 'percentage') {
      // Calculate the fixed amount equivalent to the percentage
      const fixedAmount = (priceNum * commissionNum) / 100;
      return `${fixedAmount.toFixed(2)}€`;
    } else {
      // Calculate the percentage equivalent to the fixed amount
      const percentage = (commissionNum / priceNum) * 100;
      return `${percentage.toFixed(1)}%`;
    }
  };
  
  return (
    <div className="space-y-4">
      <FormField 
        control={form.control} 
        name="price" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="120.00" 
                {...field} 
                className="mobile-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <div className="space-y-2">
        <FormLabel>Comisión - Opcional</FormLabel>
        
        <FormField
          control={form.control}
          name="commissionType"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Porcentaje (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Cantidad fija (€)</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField 
          control={form.control} 
          name="commission" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  max={commissionType === 'percentage' ? "100" : undefined} 
                  step={commissionType === 'percentage' ? "0.1" : "0.01"} 
                  placeholder={commissionType === 'percentage' ? "10.0" : "25.00"} 
                  {...field} 
                  className="mobile-input"
                />
              </FormControl>
              {commission && price && (
                <p className="text-xs text-muted-foreground mt-1">
                  Equivalente a: {getEquivalentValue()}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
    </div>
  );
}
