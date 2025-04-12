
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Transfer } from '@/types';
import { transferSchema, TransferFormValues } from '../schema/transferSchema';
import { toast } from 'sonner';

interface UseTransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
  newClientId?: string | null;
}

export function useTransferForm({
  onSubmit,
  initialValues,
  isEditing = false,
  newClientId = null
}: UseTransferFormProps) {
  const [activeTab, setActiveTab] = useState<'transfer' | 'dispo'>(
    initialValues?.serviceType || 'transfer'
  );

  // Function to get default values for the form based on initialValues
  const getDefaultValues = (): TransferFormValues => {
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

  // Handle tab change
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

  // Form submission handler
  const handleSubmit = (values: TransferFormValues) => {
    const processedValues = {
      ...values,
      serviceType: activeTab,
      price: Number(values.price),
      discountValue: values.discountValue ? Number(values.discountValue) : 0,
      commission: values.commission ? Number(values.commission) : 0,
      extraCharges: values.extraCharges
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
    }
    
    toast.success(isEditing ? 'Transfer actualizado con éxito' : 'Transfer creado con éxito');
  };

  return {
    form,
    activeTab,
    handleTabChange,
    handleSubmit
  };
}
