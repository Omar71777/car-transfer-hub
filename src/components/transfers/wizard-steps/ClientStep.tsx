
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, UserCircle } from 'lucide-react';

interface ClientStepProps {
  clients: Client[];
  collaborators: any;
  formState: any;
}

export function ClientStep({ clients, collaborators, formState }: ClientStepProps) {
  const { control, setValue, getValues, watch } = useFormContext();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  
  const clientId = watch('clientId');

  const handleAddNewClient = () => {
    setIsNewClientDialogOpen(true);
  };

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientName = getValues('clientName');
    
    if (!clientName) {
      return;
    }
    
    // Set the client ID to 'new' to indicate it's a new client
    setValue('clientId', 'new', { shouldValidate: true });
    setIsNewClientDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <UserCircle className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">¿Quién es el cliente de este transfer?</h2>
        <p className="text-muted-foreground mt-1">
          Selecciona un cliente de la lista o crea uno nuevo
        </p>
      </div>

      <FormField
        control={control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
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
                    {clientId === 'new' && (
                      <SelectItem value="new">
                        Nuevo cliente: {getValues('clientName')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
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
              control={control}
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
            
            <FormField
              control={control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email del cliente" />
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
    </div>
  );
}
