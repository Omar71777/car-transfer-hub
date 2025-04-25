
import React, { useState, useEffect } from 'react';
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
  onNewClientCreated?: (client: Client) => void;
}

export function ClientField({ form, clients, onNewClientCreated }: ClientFieldProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');

  // Handle setting a new client
  const handleAddNewClient = () => {
    setIsNewClientDialogOpen(true);
  };

  // Handle new client submission
  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientNameValue) {
      return;
    }
    
    // Update form values with new client data
    form.setValue('clientName', clientNameValue);
    form.setValue('clientEmail', clientEmailValue);
    
    // Set the client ID to 'new' to indicate it's a new client
    form.setValue('clientId', 'new', { shouldValidate: true });
    setIsNewClientDialogOpen(false);
    
    console.log('New client data set:', { 
      clientId: 'new', 
      clientName: clientNameValue, 
      clientEmail: clientEmailValue 
    });
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
                value={field.value}
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nombre *</Label>
                <Input 
                  id="clientName" 
                  value={clientNameValue} 
                  onChange={(e) => setClientNameValue(e.target.value)}
                  placeholder="Nombre del cliente" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input 
                  id="clientEmail" 
                  type="email" 
                  value={clientEmailValue} 
                  onChange={(e) => setClientEmailValue(e.target.value)}
                  placeholder="Email del cliente" 
                />
              </div>
            </div>
            
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
