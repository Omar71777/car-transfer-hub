import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Transfer } from '@/types';
import { useDialog } from '@/components/ui/dialog-service';
import { useTransferForm } from './hooks/useTransferForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, User, Banknote, Receipt } from 'lucide-react';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { useClients } from '@/hooks/useClients';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useExtraCharges } from './hooks/useExtraCharges';
import { BasicInfoTab } from './form-tabs/BasicInfoTab';
import { LocationTab } from './form-tabs/LocationTab';
import { PricingTab } from './form-tabs/PricingTab';
import { CollaboratorTab } from './form-tabs/CollaboratorTab';
import { ExtraChargesTab } from './form-tabs/ExtraChargesTab';

// Component for the edit dialog content
export function TransferEditContent({
  onSubmit,
  onClose,
  transfer
}: {
  onSubmit: (values: any) => void;
  onClose: () => void;
  transfer: Transfer;
}) {
  const { clients, fetchClients } = useClients();
  const { collaborators } = useCollaborators();
  
  const { 
    form, 
    activeTab, 
    handleTabChange, 
    handleSubmit 
  } = useTransferForm({
    onSubmit: (values) => {
      // Include the transfer ID in the submitted values
      onSubmit({ ...values, id: transfer.id });
      onClose();
    },
    initialValues: transfer,
    isEditing: true
  });
  
  const { 
    extraCharges, 
    handleAddExtraCharge, 
    handleRemoveExtraCharge, 
    handleExtraChargeChange
  } = useExtraCharges(
    transfer.extraCharges 
      ? transfer.extraCharges.map(charge => ({
          id: charge.id,
          name: charge.name,
          price: typeof charge.price === 'number' ? charge.price.toString() : charge.price
        }))
      : []
  );
  
  useEffect(() => {
    if (extraCharges.length > 0) {
      form.setValue('extraCharges', extraCharges);
    }
  }, [extraCharges, form]);

  // Add a client created handler for BasicInfoTab
  const handleClientCreated = async () => {
    await fetchClients();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Transfer</DialogTitle>
        <DialogDescription>
          Modifica los detalles del transfer seleccionado.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <ServiceTypeSelector 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="basic" className="text-xs">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Básico</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="text-xs">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Ubicación</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs">
                <Banknote className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Precio</span>
              </TabsTrigger>
              <TabsTrigger value="collaborator" className="text-xs">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Colaborador</span>
              </TabsTrigger>
              <TabsTrigger value="extras" className="text-xs">
                <Receipt className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Extras</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <BasicInfoTab 
                form={form} 
                serviceType={activeTab}
                clients={clients}
                onClientCreated={handleClientCreated}
                isClientsLoading={false}
              />
            </TabsContent>
            
            <TabsContent value="location">
              <LocationTab 
                form={form} 
                serviceType={activeTab}
              />
            </TabsContent>
            
            <TabsContent value="pricing">
              <PricingTab 
                form={form} 
                serviceType={activeTab}
              />
            </TabsContent>
            
            <TabsContent value="collaborator">
              <CollaboratorTab collaborators={collaborators} />
            </TabsContent>
            
            <TabsContent value="extras">
              <ExtraChargesTab 
                extraCharges={extraCharges}
                onAddCharge={handleAddExtraCharge}
                onRemoveCharge={handleRemoveExtraCharge}
                onChangeCharge={handleExtraChargeChange}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

// Function to open the dialog using the dialog service
export function openTransferEditDialog(
  dialogService: ReturnType<typeof useDialog>,
  onSubmit: (values: any) => void,
  transfer: Transfer
) {
  const { openDialog, closeDialog } = dialogService;
  
  openDialog(
    <TransferEditContent
      onSubmit={onSubmit}
      onClose={closeDialog}
      transfer={transfer}
    />,
    {
      width: 'lg',
      preventOutsideClose: false,
      onClose: () => {
        console.log('Edit dialog closed');
        document.body.style.pointerEvents = 'auto';
      }
    }
  );
}

// Legacy component for backward compatibility
interface TransferEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  transfer: Transfer;
}

export function TransferEditDialog({
  isOpen,
  onClose,
  onSubmit,
  transfer
}: TransferEditDialogProps) {
  const dialogService = useDialog();
  
  // Only open the dialog once when isOpen changes from false to true
  React.useEffect(() => {
    let mounted = true;
    
    if (isOpen && transfer && mounted) {
      openTransferEditDialog(
        dialogService, 
        (values) => {
          if (mounted) {
            onSubmit(values);
            onClose();
          }
        },
        transfer
      );
    }
    
    return () => { mounted = false; };
  }, [isOpen, transfer, dialogService, onSubmit, onClose]);
  
  return null;
}
