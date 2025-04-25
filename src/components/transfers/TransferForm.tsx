
import React, { useEffect } from 'react';
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

interface TransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
  newClientId?: string | null;
}

export function TransferForm({
  onSubmit,
  initialValues,
  isEditing = false,
  newClientId = null
}: TransferFormProps) {
  const {
    clients,
    loading: loadingClients,
    fetchClients,
    getClient
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

  // Set extra charges in the form whenever they change
  useEffect(() => {
    if (extraCharges.length > 0) {
      form.setValue('extraCharges', extraCharges);
    }
  }, [extraCharges, form]);

  useEffect(() => {
    fetchClients();
    fetchCollaborators();
  }, [fetchClients, fetchCollaborators]);

  // Custom submit handler to process extra charges
  const handleFormSubmit = (values: any) => {
    const processedValues = {
      ...values,
      // Make sure extra charges are properly processed
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
            
            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-base font-semibold mb-4">Información Básica</h3>
              <BasicInfoTab 
                form={form} 
                serviceType={activeTab} 
                clients={clients}
              />
            </div>
            
            <Separator className="my-6" />
            
            {/* Section 2: Pricing */}
            <div>
              <h3 className="text-base font-semibold mb-4">Precio y Pago</h3>
              <PricingTab form={form} serviceType={activeTab} />
            </div>
            
            <Separator className="my-6" />
            
            {/* Section 3: Collaborator */}
            <div>
              <h3 className="text-base font-semibold mb-4">Información del Colaborador</h3>
              <CollaboratorField collaborators={collaborators} />
            </div>
            
            <Separator className="my-6" />
            
            {/* Section 4: Extra Charges */}
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
