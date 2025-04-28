
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client, CreateClientDto } from '@/types/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';

interface ClientFieldProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
  onClientCreated?: () => Promise<void>;
  isClientsLoading?: boolean;
}

export function ClientField({ form, clients, onClientCreated, isClientsLoading = false }: ClientFieldProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  
  const { createClient } = useClients();

  const handleAddNewClient = () => {
    setIsNewClientDialogOpen(true);
  };

  const handleNewClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientNameValue) {
      toast.error('El nombre del cliente es requerido');
      return;
    }

    try {
      setIsCreatingClient(true);
      console.log('Creating client:', clientNameValue);
      
      const newClientData: CreateClientDto = {
        name: clientNameValue,
        email: clientEmailValue || `${clientNameValue.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      };
      
      const newClient = await createClient(newClientData);
      
      if (newClient) {
        console.log('Client created successfully with ID:', newClient.id);
        toast.success('Cliente creado exitosamente');
        
        // Clear form values
        setClientNameValue('');
        setClientEmailValue('');
        
        // Refresh the clients list first
        if (onClientCreated) {
          console.log('Refreshing client list...');
          await onClientCreated();
          console.log('Client list refreshed');
        }
        
        // Close dialog after client list is refreshed
        setIsNewClientDialogOpen(false);
        
        // Now update the form with the new client ID
        console.log('Setting form value to new client ID:', newClient.id);
        form.setValue('clientId', newClient.id, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error al crear el cliente');
    } finally {
      setIsCreatingClient(false);
    }
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
                disabled={isClientsLoading}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={isClientsLoading ? "Cargando clientes..." : "Seleccionar cliente"} />
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
                onClick={handleAddNewClient}
                className="flex-shrink-0"
                disabled={isCreatingClient}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Dialog open={isNewClientDialogOpen} onOpenChange={(open) => {
        if (!isCreatingClient) {
          setIsNewClientDialogOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewClientSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clientName">Nombre *</Label>
              <Input 
                id="clientName" 
                value={clientNameValue} 
                onChange={(e) => setClientNameValue(e.target.value)}
                placeholder="Nombre del cliente" 
                required 
                disabled={isCreatingClient}
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
                disabled={isCreatingClient}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewClientDialogOpen(false)}
                disabled={isCreatingClient}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreatingClient}>
                {isCreatingClient ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : 'Añadir Cliente'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
