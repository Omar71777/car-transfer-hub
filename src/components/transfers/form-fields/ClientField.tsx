
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client, CreateClientDto } from '@/types/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ClientFieldProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
  onClientCreated?: () => Promise<void>;
  isClientsLoading?: boolean;
}

export function ClientField({ 
  form, 
  clients, 
  onClientCreated, 
  isClientsLoading = false 
}: ClientFieldProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isVerifyingClient, setIsVerifyingClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [newClientId, setNewClientId] = useState<string | null>(null);
  
  const { createClient } = useClients();

  // Effect to handle client verification and retries
  useEffect(() => {
    let timeoutId: number;
    
    const verifyAndUpdateClient = async () => {
      if (!newClientId || !isVerifyingClient) return;
      
      console.log(`Verifying client existence (attempt ${retryCount + 1})...`);
      
      const clientExists = clients.some(c => c.id === newClientId);
      
      if (clientExists) {
        console.log('Client found in list, updating form value');
        form.setValue('clientId', newClientId, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        
        // Reset states
        setNewClientId(null);
        setIsVerifyingClient(false);
        setRetryCount(0);
        toast.success('Cliente creado exitosamente');
        setIsNewClientDialogOpen(false);
      } else if (retryCount < 3) {
        console.log(`Client not found in list, retrying (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        
        // Trigger another client list refresh
        if (onClientCreated) {
          try {
            await onClientCreated();
            console.log('Client list refreshed, checking again in 500ms');
            
            // Wait a short time for state to update
            timeoutId = window.setTimeout(verifyAndUpdateClient, 500);
          } catch (error) {
            console.error('Error refreshing client list:', error);
            setCreateError('Error al actualizar la lista de clientes');
            setIsVerifyingClient(false);
          }
        }
      } else {
        console.error('Maximum retry attempts reached, client not found');
        setCreateError('Cliente creado pero no aparece en la lista. Intente cerrar y volver a abrir el formulario.');
        setIsVerifyingClient(false);
        setRetryCount(0);
        
        // Even though verification failed, still use the ID
        form.setValue('clientId', newClientId, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    };
    
    if (isVerifyingClient && newClientId) {
      verifyAndUpdateClient();
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [clients, newClientId, isVerifyingClient, retryCount, form, onClientCreated]);

  const handleAddNewClient = () => {
    setCreateError(null);
    setClientNameValue('');
    setClientEmailValue('');
    setIsNewClientDialogOpen(true);
  };

  const handleNewClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientNameValue) {
      setCreateError('El nombre del cliente es requerido');
      return;
    }

    try {
      setIsCreatingClient(true);
      setCreateError(null);
      console.log('Creating client:', clientNameValue);
      
      const newClientData: CreateClientDto = {
        name: clientNameValue,
        email: clientEmailValue || `${clientNameValue.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      };
      
      const newClient = await createClient(newClientData);
      
      if (newClient) {
        console.log('Client created successfully with ID:', newClient.id);
        
        // Clear form values
        setClientNameValue('');
        setClientEmailValue('');
        
        // Store the new client ID for verification
        setNewClientId(newClient.id);
        
        // First refresh the clients list
        if (onClientCreated) {
          console.log('Refreshing client list...');
          await onClientCreated();
          console.log('Initial client list refresh completed');
        }
        
        // Start verification process
        setIsVerifyingClient(true);
        setRetryCount(0);
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      setCreateError(error.message || 'Error al crear el cliente');
      toast.error('Error al crear el cliente');
    } finally {
      setIsCreatingClient(false);
    }
  };

  const isSelectDisabled = isClientsLoading || isCreatingClient || isVerifyingClient;
  const dialogStatus = isCreatingClient ? 'creating' : isVerifyingClient ? 'verifying' : 'idle';

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
                disabled={isSelectDisabled}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    {isClientsLoading ? (
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
                onClick={handleAddNewClient}
                className="flex-shrink-0"
                disabled={isCreatingClient || isVerifyingClient}
              >
                {isCreatingClient || isVerifyingClient ? (
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

      <Dialog open={isNewClientDialogOpen} onOpenChange={(open) => {
        // Only allow closing if not in the middle of an operation
        if (!isCreatingClient && !isVerifyingClient) {
          setIsNewClientDialogOpen(open);
          if (!open) {
            setCreateError(null);
            setNewClientId(null);
            setRetryCount(0);
            setIsVerifyingClient(false);
          }
        } else if (!open) {
          // Show message that operation is in progress
          toast.info('Por favor espere a que se complete la operación');
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
                disabled={isCreatingClient || isVerifyingClient}
                className={createError ? 'border-destructive' : ''}
              />
              {createError && (
                <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <p>{createError}</p>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input 
                id="clientEmail" 
                type="email" 
                value={clientEmailValue} 
                onChange={(e) => setClientEmailValue(e.target.value)}
                placeholder="Email del cliente"
                disabled={isCreatingClient || isVerifyingClient}
              />
            </div>
            
            {(isCreatingClient || isVerifyingClient) && (
              <div className="py-2">
                <div className="flex items-center justify-center gap-2">
                  <Loader className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {dialogStatus === 'creating' ? 'Creando cliente...' : 'Verificando cliente...'}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewClientDialogOpen(false)}
                disabled={isCreatingClient || isVerifyingClient}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isCreatingClient || isVerifyingClient}
              >
                {isCreatingClient ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : isVerifyingClient ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
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
