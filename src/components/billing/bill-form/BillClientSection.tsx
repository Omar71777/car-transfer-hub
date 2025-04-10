
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/types/client';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

// Define the schema type using the parent schema
interface BillClientSectionProps {
  form: UseFormReturn<any>;
  clients: Client[];
  onClientChange: (clientId: string) => void;
}

export function BillClientSection({ form, clients, onClientChange }: BillClientSectionProps) {
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <Select 
            onValueChange={(value) => onClientChange(value)} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
