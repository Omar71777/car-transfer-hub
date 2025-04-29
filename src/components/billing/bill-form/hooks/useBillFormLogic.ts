
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Client } from '@/types/client';
import { CreateBillDto, TaxApplicationType } from '@/types/billing';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';
import { useTransfers } from '@/hooks/useTransfers';
import { useQueryClient } from '@tanstack/react-query';

const billSchema = z.object({
  clientId: z.string().min(1, { message: 'El cliente es requerido' }),
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  dueDate: z.string().min(1, { message: 'La fecha de vencimiento es requerida' }),
  taxRate: z.coerce.number().min(0, { message: 'El IVA debe ser un número positivo' }).default(10),
  taxApplication: z.enum(['included', 'excluded'], {
    required_error: 'Debe seleccionar cómo aplicar el IVA',
  }).default('excluded'),
  notes: z.string().optional(),
});

export function useBillFormLogic(onSubmit: (values: CreateBillDto) => Promise<void>) {
  const queryClient = useQueryClient();
  const { clients, loading: loadingClients, fetchClients } = useClients();
  const { transfers, fetchTransfers } = useTransfers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      clientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      taxRate: 10,
      taxApplication: 'excluded',
      notes: '',
    },
  });

  useEffect(() => {
    fetchClients();
    fetchTransfers();
  }, [fetchClients, fetchTransfers]);

  useEffect(() => {
    const clientId = form.watch('clientId');
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [form.watch('clientId'), clients]);

  const handleClientChange = (clientId: string) => {
    form.setValue('clientId', clientId);
  };

  const handleClientCreated = async () => {
    try {
      // Invalidate and refresh clients query
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      await fetchClients();
      toast.success('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error refreshing clients after creation:', error);
    }
  };

  const handleSubmit = async (values: z.infer<typeof billSchema>, selectedTransfers: string[]) => {
    if (selectedTransfers.length === 0) {
      form.setError('root', { 
        message: 'Debe seleccionar al menos un transfer para facturar' 
      });
      return;
    }

    const billData: CreateBillDto = {
      clientId: values.clientId,
      date: values.date,
      dueDate: values.dueDate,
      transferIds: selectedTransfers,
      taxRate: values.taxRate,
      taxApplication: values.taxApplication as TaxApplicationType,
      notes: values.notes
    };

    setIsSubmitting(true);
    
    try {
      await onSubmit(billData);
      toast.success("Factura creada con éxito");
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error("Error al crear la factura");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  return {
    form,
    clients,
    loadingClients,
    selectedClient,
    isSubmitting,
    transfers,
    handleClientChange,
    handleClientCreated,
    handleSubmit,
    formatCurrency
  };
}
