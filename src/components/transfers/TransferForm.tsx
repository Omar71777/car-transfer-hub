
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Transfer, ExtraCharge } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useClients } from '@/hooks/useClients';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { DateTimeFields } from './form-fields/DateTimeFields';
import { LocationFields } from './form-fields/LocationFields';
import { PricingFields } from './form-fields/PricingFields';
import { CollaboratorField } from './form-fields/CollaboratorField';
import { ClientField } from './form-fields/ClientField';
import { PaymentStatusField } from './form-fields/PaymentStatusField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExtraChargesForm } from './form-fields/ExtraChargesForm';
import { v4 as uuidv4 } from 'uuid';

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

  // State for the service type and extra charges
  const [serviceType, setServiceType] = useState<'transfer' | 'dispo'>(initialValues?.serviceType || 'transfer');
  const [extraCharges, setExtraCharges] = useState<Partial<ExtraCharge>[]>(
    initialValues?.extraCharges || []
  );

  // Ensure collaborators and clients are fetched when the component mounts
  React.useEffect(() => {
    fetchCollaborators();
    fetchClients();
  }, [fetchCollaborators, fetchClients]);

  // Convert numeric values to string for the form
  const getDefaultValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        serviceType: initialValues.serviceType || 'transfer',
        price: initialValues.price.toString(),
        discountType: initialValues.discountType || null,
        discountValue: initialValues.discountValue?.toString() || '',
        commissionType: initialValues.commissionType || 'percentage',
        commission: initialValues.commission?.toString() || '',
        paymentStatus: initialValues.paymentStatus as 'paid' | 'pending',
        clientId: initialValues.clientId || '',
        extraCharges: initialValues.extraCharges || []
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

  // Update form when service type changes
  useEffect(() => {
    setServiceType(form.watch('serviceType'));
  }, [form.watch]);

  // Handle extra charges
  const handleAddExtraCharge = () => {
    setExtraCharges([...extraCharges, { id: uuidv4(), name: '', price: 0 }]);
  };

  const handleRemoveExtraCharge = (index: number) => {
    const newExtraCharges = [...extraCharges];
    newExtraCharges.splice(index, 1);
    setExtraCharges(newExtraCharges);
  };

  const handleExtraChargeChange = (index: number, field: keyof ExtraCharge, value: any) => {
    const newExtraCharges = [...extraCharges];
    (newExtraCharges[index] as any)[field] = value;
    setExtraCharges(newExtraCharges);
  };

  function handleSubmit(values: TransferFormValues) {
    // Convert string values to numbers where appropriate
    const processedValues = {
      ...values,
      serviceType: serviceType,
      price: Number(values.price),
      discountValue: values.discountValue ? Number(values.discountValue) : 0,
      commission: values.commission ? Number(values.commission) : 0,
      // Process extra charges
      extraCharges: extraCharges
        .filter(charge => charge.name && charge.price)
        .map(charge => ({
          id: charge.id,
          name: charge.name,
          price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
        })),
      // Store the commission type along with the value
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
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de servicio *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setServiceType(value as 'transfer' | 'dispo');
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="transfer" id="transfer-type" />
                              <Label htmlFor="transfer-type">Transfer (Punto a punto)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dispo" id="dispo-type" />
                              <Label htmlFor="dispo-type">Disposición (Por horas)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DateTimeFields form={form} />
                  
                  {serviceType === 'transfer' ? (
                    <>
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lugar de recogida *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Aeropuerto de Ibiza" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lugar de destino *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Hotel Ushuaïa" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Punto de inicio *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Hotel Ushuaïa" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horas contratadas *</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" step="1" placeholder="4" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ClientField form={form} clients={clients} />
                    <CollaboratorField form={form} collaborators={collaborators} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio{serviceType === 'dispo' ? ' por hora' : ''} (€) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="120.00" 
                          {...field} 
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {serviceType === 'dispo' && form.watch('hours') && (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Precio total para {form.watch('hours')} horas: €
                      {((Number(form.watch('price')) || 0) * (Number(form.watch('hours')) || 0)).toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <FormLabel>Descuento (opcional)</FormLabel>
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ''} 
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo de descuento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Sin descuento</SelectItem>
                            <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                            <SelectItem value="fixed">Monto fijo (€)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('discountType') && (
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max={form.watch('discountType') === 'percentage' ? "100" : undefined}
                              step={form.watch('discountType') === 'percentage' ? "1" : "0.01"} 
                              placeholder={form.watch('discountType') === 'percentage' ? "10" : "25.00"} 
                              {...field} 
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <PaymentStatusField form={form} />
                
                <PricingFields form={form} />
              </TabsContent>
              
              <TabsContent value="extras">
                <ExtraChargesForm 
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
