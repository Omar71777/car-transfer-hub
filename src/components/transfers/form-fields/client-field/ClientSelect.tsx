
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Client } from '@/types/client';
import { TransferFormValues } from '../../schema/transferSchema';

interface ClientSelectProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
  isLoading: boolean;
  isCreating: boolean;
  onAddNew: () => void;
}

export function ClientSelect({ 
  form, 
  clients, 
  isLoading, 
  isCreating, 
  onAddNew 
}: ClientSelectProps) {
  const isSelectDisabled = isLoading || isCreating;

  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente *</FormLabel>
          <div className="flex gap-2">
            <Select
              onValueChange={(value) => {
                console.log('ClientSelect: Select onValueChange triggered with value:', value);
                field.onChange(value);
              }}
              value={field.value}
              disabled={isSelectDisabled}
            >
              <FormControl>
                <SelectTrigger className="flex-1">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Cargando clientes...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Seleccionar cliente" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onAddNew}
              className="flex-shrink-0"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-1" />
              )}
              Nuevo
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
