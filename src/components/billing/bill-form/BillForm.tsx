
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { CreateBillDto } from '@/types/billing';
import { FormContent } from './components/FormContent';
import { useBillFormLogic } from './hooks/useBillFormLogic';
import { useTransferFiltering } from './useTransferFiltering';
import { useBillPreview } from './useBillPreview';

interface BillFormProps {
  onSubmit: (values: CreateBillDto) => Promise<void>;
}

export function BillForm({ onSubmit }: BillFormProps) {
  const {
    form,
    clients,
    loadingClients,
    selectedClient,
    isSubmitting,
    transfers,
    handleClientChange,
    handleSubmit,
    formatCurrency
  } = useBillFormLogic(onSubmit);

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
    form.watch('taxApplication'),
    selectedClient
  );

  return (
    <Card className="glass-card w-full max-w-4xl mx-auto">
      <CardContent className="pt-4 px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormContent 
              form={form}
              clients={clients}
              loadingClients={loadingClients}
              isSubmitting={isSubmitting}
              isCalculating={isCalculating}
              billPreview={billPreview}
              selectedTransfers={selectedTransfers}
              filteredTransfers={filteredTransfers}
              transferFilter={transferFilter}
              handleClientChange={handleClientChange}
              handleTransferToggle={handleTransferToggle}
              handleSelectAllTransfers={handleSelectAllTransfers}
              setTransferFilter={setTransferFilter}
              formatCurrency={formatCurrency}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
