
import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { transferSchema, TransferFormValues } from '../schema/transferSchema';
import { Transfer } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

interface UseTransferFormStateProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
  initialClientId?: string | null;
}

export function useTransferFormState({
  onSubmit,
  initialValues,
  isEditing = false,
  initialClientId = null
}: UseTransferFormStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCollaboratorStep, setShowCollaboratorStep] = useState(!isEditing && !initialValues?.collaborator);
  const [isServicioPropio, setIsServicioPropio] = useState(
    initialValues?.collaborator === 'servicio propio' || false
  );
  
  const { user } = useAuth();
  
  const getDefaultValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        serviceType: initialValues.serviceType || 'transfer',
        price: initialValues.price.toString(),
        hours: initialValues.hours !== undefined ? initialValues.hours.toString() : '',
        discountType: initialValues.discountType || null,
        discountValue: initialValues.discountValue?.toString() || '',
        commissionType: initialValues.commissionType || 'percentage',
        commission: initialValues.commission?.toString() || '',
        paymentStatus: initialValues.paymentStatus || 'pending',
        clientId: initialValues.clientId || initialClientId || '',
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
      clientId: initialClientId || '',
      extraCharges: []
    };
  };
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });
  
  // Update client ID when it changes externally
  useEffect(() => {
    if (initialClientId) {
      form.setValue('clientId', initialClientId, { shouldValidate: true });
    }
  }, [initialClientId, form]);
  
  return {
    form,
    currentStep,
    setCurrentStep,
    showCollaboratorStep,
    setShowCollaboratorStep,
    isServicioPropio,
    setIsServicioPropio,
    user
  };
}
