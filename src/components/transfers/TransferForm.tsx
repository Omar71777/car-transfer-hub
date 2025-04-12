
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Transfer } from '@/types';
import { useClients } from '@/hooks/useClients';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExtraCharges } from './hooks/useExtraCharges';
import { BasicInfoTab } from './form-tabs/BasicInfoTab';
import { PricingTab } from './form-tabs/PricingTab';
import { ExtraChargesTab } from './form-tabs/ExtraChargesTab';
import { Car, Clock } from 'lucide-react';

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
    fetchClients
  } = useClients();

  const [activeTab, setActiveTab] = useState<'transfer' | 'dispo'>(
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
    fetchClients();
  }, [fetchClients]);

  // Function to get default values for the form based on initialValues
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
        clientId: initialValues.clientId || newClientId || '',
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
      serviceType: activeTab,
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
      clientId: newClientId || '',
      extraCharges: []
    };
  };

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues()
  });

  // Update client ID when it changes externally
  useEffect(() => {
    if (newClientId) {
      form.setValue('clientId', newClientId, { shouldValidate: true });
    }
  }, [newClientId, form]);

  // Update service type when tab changes
  useEffect(() => {
    form.setValue('serviceType', activeTab, { shouldValidate: true });
  }, [activeTab, form]);

  // Update form based on active tab
  const handleTabChange = (value: string) => {
    const newServiceType = value as 'transfer' | 'dispo';
    setActiveTab(newServiceType);
    
    // Clear fields that are not relevant for the current service type
    if (newServiceType === 'transfer') {
      form.setValue('hours', '', { shouldValidate: false });
    } else if (newServiceType === 'dispo') {
      form.setValue('destination', 'N/A', { shouldValidate: false });
    }
  };

  function handleSubmit(values: TransferFormValues) {
    const processedValues = {
      ...values,
      serviceType: activeTab,
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
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="transfer" className="flex items-center">
                  <Car className="h-4 w-4 mr-2" />
                  <span>Transfer</span>
                </TabsTrigger>
                <TabsTrigger value="dispo" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Disposición</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  {activeTab === 'transfer' 
                    ? 'Servicio de Transfer (punto a punto)' 
                    : 'Servicio de Disposición (por horas)'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'transfer' 
                    ? 'Complete los detalles del traslado de un punto a otro' 
                    : 'Complete los detalles del servicio por horas'}
                </p>
              </div>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="pricing">Precio</TabsTrigger>
                  <TabsTrigger value="extras">Cargos Extra</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <BasicInfoTab 
                    form={form} 
                    serviceType={activeTab} 
                    clients={clients}
                  />
                </TabsContent>
                
                <TabsContent value="pricing" className="space-y-4">
                  <PricingTab form={form} serviceType={activeTab} />
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
