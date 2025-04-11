
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Transfer } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useClients } from '@/hooks/useClients';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExtraCharges } from './hooks/useExtraCharges';
import { BasicInfoTab } from './form-tabs/BasicInfoTab';
import { PricingTab } from './form-tabs/PricingTab';
import { ExtraChargesTab } from './form-tabs/ExtraChargesTab';

interface TransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
}

export function TransferForm({
  onSubmit,
  initialValues,
  isEditing = false
}: TransferFormProps) {
  const {
    collaborators,
    loading: loadingCollaborators,
    fetchCollaborators
  } = useCollaborators();
  
  const {
    clients,
    loading: loadingClients,
    fetchClients
  } = useClients();

  const [serviceType, setServiceType] = useState<'transfer' | 'dispo'>(
    initialValues?.serviceType || 'transfer'
  );
  
  const { 
    extraCharges, 
    setExtraCharges, 
    handleAddExtraCharge, 
    handleRemoveExtraCharge, 
    handleExtraChargeChange 
  } = useExtraCharges(
    initialValues?.extraCharges 
      ? initialValues.extraCharges.map(charge => ({
          id: charge.id,
          name: charge.name,
          price: typeof charge.price === 'number' ? charge.price.toString() : charge.price
        }))
      : []
  );

  useEffect(() => {
    fetchCollaborators();
    fetchClients();
  }, [fetchCollaborators, fetchClients]);

  const getDefaultValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        serviceType: initialValues.serviceType || 'transfer',
        price: initialValues.price.toString(),
        // Convert hours to string regardless of whether it's a number or string
        hours: initialValues.hours !== undefined ? initialValues.hours.toString() : '',
        discountType: initialValues.discountType || null,
        discountValue: initialValues.discountValue?.toString() || '',
        commissionType: initialValues.commissionType || 'percentage',
        commission: initialValues.commission?.toString() || '',
        paymentStatus: initialValues.paymentStatus as 'paid' | 'pending',
        clientId: initialValues.clientId || '',
        extraCharges: initialValues.extraCharges 
          ? initialValues.extraCharges.map(charge => ({
              id: charge.id,
              name: charge.name,
              price: typeof charge.price === 'number' ? charge.price.toString() : charge.price
            }))
          : []
      };
    }
    return {
      date: new Date().toISOString().split('T')[0],
      time: '',
      serviceType: 'transfer' as const,
      origin: '',
      destination: '',
      hours: '',
      price: '',
      discountType: null,
      discountValue: '',
      collaborator: '',
      commissionType: 'percentage' as const,
      commission: '',
      paymentStatus: 'pending' as const,
      clientId: '',
      extraCharges: []
    };
  };

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues()
  });

  function handleSubmit(values: TransferFormValues) {
    const processedValues = {
      ...values,
      serviceType: serviceType,
      price: Number(values.price),
      discountValue: values.discountValue ? Number(values.discountValue) : 0,
      commission: values.commission ? Number(values.commission) : 0,
      extraCharges: extraCharges
        .filter(charge => charge.name && charge.price)
        .map(charge => ({
          id: charge.id,
          name: charge.name,
          price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
        })),
      commissionType: values.commissionType as 'percentage' | 'fixed'
    };
    
    onSubmit(processedValues);
    
    if (!isEditing) {
      form.reset();
      setExtraCharges([]);
    }
    
    toast.success(isEditing ? 'Transfer actualizado con éxito' : 'Transfer creado con éxito');
  }

  return (
    <Card className="glass-card w-full max-full mx-auto">
      <CardContent className="pt-4 px-3 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Información Básica</TabsTrigger>
                <TabsTrigger value="pricing">Precio y Descuentos</TabsTrigger>
                <TabsTrigger value="extras">Cargos Extra</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <BasicInfoTab 
                  form={form} 
                  serviceType={serviceType} 
                  setServiceType={setServiceType} 
                  clients={clients} 
                  collaborators={collaborators} 
                />
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <PricingTab form={form} serviceType={serviceType} />
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

            <Button type="submit" className="w-full mobile-btn">
              {isEditing ? 'Actualizar Transfer' : 'Registrar Transfer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
