
import React from 'react';
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
import { DateTimeFields } from './form-fields/DateTimeFields';
import { LocationFields } from './form-fields/LocationFields';
import { PricingFields } from './form-fields/PricingFields';
import { CollaboratorField } from './form-fields/CollaboratorField';
import { ClientField } from './form-fields/ClientField';
import { PaymentStatusField } from './form-fields/PaymentStatusField';

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
        price: initialValues.price.toString(),
        commissionType: initialValues.commissionType || 'percentage',
        commission: initialValues.commission?.toString() || '',
        paymentStatus: initialValues.paymentStatus as 'paid' | 'pending',
        clientId: initialValues.clientId || ''
      };
    }
    return {
      date: new Date().toISOString().split('T')[0],
      time: '',
      origin: '',
      destination: '',
      price: '',
      collaborator: '',
      commissionType: 'percentage' as const,
      commission: '',
      paymentStatus: 'pending' as const,
      clientId: ''
    };
  };

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues()
  });

  function handleSubmit(values: TransferFormValues) {
    // Convert string values to numbers where appropriate, handle empty commission
    const processedValues = {
      ...values,
      price: Number(values.price),
      commission: values.commission ? Number(values.commission) : 0,
      // Store the commission type along with the value
      commissionType: values.commissionType as 'percentage' | 'fixed'
    };
    
    onSubmit(processedValues);
    
    if (!isEditing) {
      form.reset();
    }
    
    toast.success(isEditing ? 'Transfer actualizado con éxito' : 'Transfer creado con éxito');
  }

  return (
    <Card className="glass-card w-full max-full mx-auto">
      <CardContent className="pt-4 px-3 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
            <DateTimeFields form={form} />
            <LocationFields form={form} />
            <PricingFields form={form} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ClientField form={form} clients={clients} />
              <CollaboratorField form={form} collaborators={collaborators} />
            </div>
            <PaymentStatusField form={form} />

            <Button type="submit" className="w-full mobile-btn">
              {isEditing ? 'Actualizar Transfer' : 'Registrar Transfer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
