
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bill, TaxApplicationType } from '@/types/billing';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Save } from 'lucide-react';
import { useTransfers } from '@/hooks/useTransfers';

// Import our new component parts
import { BillDetailsSection } from './BillDetailsSection';
import { BillTaxSection } from './BillTaxSection';
import { BillNotesSection } from './BillNotesSection';
import { CurrentTransfersSection } from './CurrentTransfersSection';
import { AvailableTransfersSection } from './AvailableTransfersSection';
import { useTransferSelectionState } from './useTransferSelectionState';

const billEditSchema = z.object({
  number: z.string().min(1, { message: 'El número de factura es requerido' }),
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  due_date: z.string().min(1, { message: 'La fecha de vencimiento es requerida' }),
  tax_rate: z.coerce.number().min(0, { message: 'El IVA debe ser un número positivo' }).default(10),
  tax_application: z.enum(['included', 'excluded'], {
    required_error: 'Debe seleccionar cómo aplicar el IVA',
  }).default('excluded'),
  notes: z.string().optional(),
});

export type BillEditFormValues = z.infer<typeof billEditSchema>;

interface BillEditFormProps {
  bill: Bill;
  onSubmit: (values: Partial<Bill>, addedTransferIds: string[], removedTransferIds: string[]) => Promise<void>;
}

export function BillEditForm({ bill, onSubmit }: BillEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { transfers, fetchTransfers } = useTransfers();
  
  // Use our custom hook for managing transfer selection state
  const {
    transfersToAdd,
    transfersToRemove,
    availableTransfers,
    currentTransfers,
    toggleTransferToAdd,
    toggleTransferToRemove,
    getAddableTransfers
  } = useTransferSelectionState(transfers, bill);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const form = useForm<BillEditFormValues>({
    resolver: zodResolver(billEditSchema),
    defaultValues: {
      number: bill.number,
      date: bill.date,
      due_date: bill.due_date,
      tax_rate: bill.tax_rate,
      tax_application: bill.tax_application as TaxApplicationType,
      notes: bill.notes || '',
    },
  });

  const handleSubmit = async (values: BillEditFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, transfersToAdd, transfersToRemove);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BillDetailsSection form={form} />
        
        <BillTaxSection form={form} />
        
        <BillNotesSection form={form} />

        {/* Transfers management section */}
        <div className="space-y-4 border-t pt-4">
          <CurrentTransfersSection 
            currentTransfers={currentTransfers}
            transfersToRemove={transfersToRemove}
            toggleTransferToRemove={toggleTransferToRemove}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <AvailableTransfersSection
            transfersToAdd={transfersToAdd}
            availableTransfers={availableTransfers}
            getAddableTransfers={getAddableTransfers}
            toggleTransferToAdd={toggleTransferToAdd}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
