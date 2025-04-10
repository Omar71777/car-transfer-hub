
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';
import { useTransfers } from '@/hooks/useTransfers';
import { CreateBillDto, TaxApplicationType } from '@/types/billing';
import { Client } from '@/types/client';

// Import our new component parts
import { BillClientSection } from './BillClientSection';
import { BillDateSection } from './BillDateSection';
import { BillTaxSection } from './BillTaxSection';
import { BillNotesSection } from './BillNotesSection';
import { TransfersList } from './TransfersList';
import { BillPreviewPanel } from './BillPreviewPanel';
import { useTransferFiltering } from './useTransferFiltering';
import { useBillPreview } from './useBillPreview';

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

interface BillFormProps {
  onSubmit: (values: CreateBillDto) => void;
}

export function BillForm({ onSubmit }: BillFormProps) {
  const { clients, loading: loadingClients, fetchClients } = useClients();
  const { transfers, fetchTransfers } = useTransfers();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Initialize with default values
  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      clientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days later
      taxRate: 10, // Default 10%
      taxApplication: 'excluded', // Default: Tax excluded (added on top)
      notes: '',
    },
  });

  // Custom hooks for transfer filtering and bill preview
  const {
    transferFilter,
    setTransferFilter,
    selectedTransfers,
    filteredTransfers,
    handleTransferToggle,
    handleSelectAllTransfers,
  } = useTransferFiltering(transfers, form.watch('clientId'));

  const {
    billPreview,
    isCalculating
  } = useBillPreview(
    selectedTransfers,
    form.watch('clientId'),
    form.watch('taxRate'),
    form.watch('taxApplication') as TaxApplicationType,
    selectedClient
  );

  // Fetch clients and transfers
  useEffect(() => {
    fetchClients();
    fetchTransfers();
  }, [fetchClients, fetchTransfers]);

  // Update selected client when clientId changes
  useEffect(() => {
    const clientId = form.watch('clientId');
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [form.watch('clientId'), clients]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Handle client selection change to filter transfers
  const handleClientChange = (clientId: string) => {
    form.setValue('clientId', clientId);
  };

  const handleSubmit = (values: z.infer<typeof billSchema>) => {
    if (selectedTransfers.length === 0) {
      form.setError('root', { 
        message: 'Debe seleccionar al menos un transfer para facturar' 
      });
      return;
    }

    // Ensure all required fields are present
    const billData: CreateBillDto = {
      clientId: values.clientId,
      date: values.date,
      dueDate: values.dueDate,
      transferIds: selectedTransfers,
      taxRate: values.taxRate,
      taxApplication: values.taxApplication as TaxApplicationType,
      notes: values.notes
    };

    onSubmit(billData);
  };

  return (
    <Card className="glass-card w-full max-w-4xl mx-auto">
      <CardContent className="pt-4 px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <BillClientSection 
                  form={form} 
                  clients={clients} 
                  onClientChange={handleClientChange} 
                />
                
                <BillDateSection form={form} />
                
                <BillTaxSection form={form} />
                
                <BillNotesSection form={form} />
              </div>

              <div className="space-y-4">
                <TransfersList 
                  filteredTransfers={filteredTransfers}
                  selectedTransfers={selectedTransfers}
                  onTransferToggle={handleTransferToggle}
                  onSelectAllTransfers={handleSelectAllTransfers}
                  transferFilter={transferFilter}
                  onTransferFilterChange={setTransferFilter}
                  formatCurrency={formatCurrency}
                />

                <BillPreviewPanel 
                  billPreview={billPreview} 
                  formatCurrency={formatCurrency} 
                />
              </div>
            </div>

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loadingClients || isCalculating || selectedTransfers.length === 0}
            >
              {isCalculating ? 'Calculando...' : 'Crear Factura'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
