
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientFieldProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
}

export function ClientField({ form, clients }: ClientFieldProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  // Handle setting a new client
  const handleAddNewClient = () => {
    setIsNewClientDialogOpen(true);
  };

  // Handle new client submission
  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientName = form.getValues('clientName');
    
    if (!clientName) {
      return;
    }
    
    // Set the client ID to 'new' to indicate it's a new client
    form.setValue('clientId', 'new');
    setIsNewClientDialogOpen(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente *</FormLabel>
            <div className="flex gap-2">
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                  {field.value === 'new' && (
                    <SelectItem value="new">
                      Nuevo cliente: {form.getValues('clientName')}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={handleAddNewClient} className="flex-shrink-0">
                <PlusCircle className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewClientSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del cliente" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsNewClientDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Añadir Cliente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
