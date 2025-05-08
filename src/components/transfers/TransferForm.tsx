
import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Transfer } from '@/types';
import { useClients } from '@/hooks/useClients';
import { Separator } from '@/components/ui/separator';
import { useExtraCharges, ExtraChargeForm } from './hooks/useExtraCharges';
import { BasicInfoTab } from './form-tabs/BasicInfoTab';
import { PricingTab } from './form-tabs/PricingTab';
import { ExtraChargesTab } from './form-tabs/ExtraChargesTab';
import { ServiceTypeSelector } from './components/ServiceTypeSelector';
import { useTransferForm } from './hooks/useTransferForm';
import { CollaboratorField } from './form-fields/CollaboratorField';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface TransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
  newClientId?: string | null;
  onClientCreated?: () => Promise<void>;
}

export function TransferForm({
  onSubmit,
  initialValues,
  isEditing = false,
  newClientId = null,
  onClientCreated
}: TransferFormProps) {
  const queryClient = useQueryClient();
  
  const {
    clients,
    loading: clientsLoading,
    fetchClients,
  } = useClients();

  const { 
    form, 
    activeTab, 
    handleTabChange, 
    handleSubmit 
  } = useTransferForm({
    onSubmit,
    initialValues,
    isEditing,
    newClientId
  });
  
  const { 
    extraCharges, 
    setExtraCharges, 
    handleAddExtraCharge, 
    handleRemoveExtraCharge, 
    handleExtraChargeChange,
    processExtraChargesForSubmission
  } = useExtraCharges(
    initialValues?.extraCharges 
      ? initialValues.extraCharges.map(charge => ({
          id: charge.id,
          name: charge.name,
          price: typeof charge.price === 'number' ? charge.price.toString() : charge.price
        }))
      : []
  );

  const {
    collaborators,
    loading: loadingCollaborators,
    fetchCollaborators,
  } = useCollaborators();

  useEffect(() => {
    if (extraCharges.length > 0) {
      form.setValue('extraCharges', extraCharges);
    }
  }, [extraCharges, form]);

  useEffect(() => {
    fetchClients();
    fetchCollaborators();
  }, [fetchClients, fetchCollaborators]);

  const handleClientCreated = useCallback(async () => {
    console.log('TransferForm: client created, refreshing clients list');
    try {
      // Invalidate and refresh clients query
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      if (onClientCreated) {
        await onClientCreated();
      } else {
        await fetchClients();
      }
      console.log('TransferForm: clients list refreshed successfully');
      toast.success('Lista de clientes actualizada');
    } catch (error) {
      console.error('TransferForm: error refreshing clients list', error);
      toast.error('Error al actualizar la lista de clientes');
    }
  }, [onClientCreated, fetchClients, queryClient]);

  const handleCollaboratorCreated = useCallback(async () => {
    console.log('TransferForm: collaborator created, refreshing collaborators list');
    try {
      // Invalidate and refresh collaborators query
      await queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      await fetchCollaborators();
      console.log('TransferForm: collaborators list refreshed successfully');
      toast.success('Lista de colaboradores actualizada');
    } catch (error) {
      console.error('TransferForm: error refreshing collaborators list', error);
      toast.error('Error al actualizar la lista de colaboradores');
    }
  }, [fetchCollaborators, queryClient]);

  const handleFormSubmit = (values: any) => {
    const processedValues = {
      ...values,
      extraCharges: processExtraChargesForSubmission()
    };
    
    onSubmit(processedValues);
  };

  return (
    <Card className="glass-card w-full max-full mx-auto">
      <CardContent className="pt-4 px-3 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <ServiceTypeSelector 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            
            <div>
              <h3 className="text-base font-semibold mb-4">Información Básica</h3>
              <BasicInfoTab 
                form={form} 
                serviceType={activeTab} 
                clients={clients}
                onClientCreated={handleClientCreated}
                isClientsLoading={clientsLoading}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-base font-semibold mb-4">Precio y Pago</h3>
              <PricingTab form={form} serviceType={activeTab} />
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-base font-semibold mb-4">Información del Colaborador</h3>
              <CollaboratorField 
                collaborators={collaborators} 
                onCollaboratorCreated={handleCollaboratorCreated}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-base font-semibold mb-4">Cargos Extra</h3>
              <ExtraChargesTab 
                extraCharges={extraCharges}
                onAddCharge={handleAddExtraCharge}
                onRemoveCharge={handleRemoveExtraCharge}
                onChangeCharge={handleExtraChargeChange}
              />
            </div>

            <Button type="submit" className="w-full mobile-btn mt-8">
              {isEditing ? 'Actualizar Transfer' : 'Registrar Transfer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
