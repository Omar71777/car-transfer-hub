
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClients } from '@/hooks/useClients';
import { Client, CreateClientDto } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const ClientsPage = () => {
  const { clients, loading, fetchClients, createClient, updateClient, deleteClient } = useClients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values: CreateClientDto) => {
    if (selectedClient) {
      const success = await updateClient(selectedClient.id, values);
      if (success) {
        toast.success('Cliente actualizado con éxito');
        setIsFormOpen(false);
        fetchClients();
      }
    } else {
      const clientId = await createClient(values);
      if (clientId) {
        toast.success('Cliente creado con éxito');
        setIsFormOpen(false);
        fetchClients();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;

    const success = await deleteClient(selectedClient.id);
    if (success) {
      toast.success('Cliente eliminado con éxito');
      setIsDeleteDialogOpen(false);
      fetchClients();
    }
  };

  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes para facturación</p>
        </div>

        <ClientsTable
          clients={clients}
          onAdd={handleAddClient}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedClient ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <ClientForm
                initialValues={selectedClient || {}}
                onSubmit={handleFormSubmit}
                isEditing={!!selectedClient}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{' '}
                <strong>{selectedClient?.name}</strong> del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
