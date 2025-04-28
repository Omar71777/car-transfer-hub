
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { BillClientSection } from '../BillClientSection';
import { BillDateSection } from '../BillDateSection';
import { BillTaxSection } from '../BillTaxSection';
import { BillNotesSection } from '../BillNotesSection';
import { TransfersList } from '../TransfersList';
import { BillPreviewPanel } from '../BillPreviewPanel';
import { Client } from '@/types/client';
import { Transfer } from '@/types';
import { BillPreview } from '@/types/billing';

interface FormContentProps {
  form: UseFormReturn<any>;
  clients: Client[];
  loadingClients: boolean;
  isSubmitting: boolean;
  isCalculating: boolean;
  billPreview: BillPreview | null;
  selectedTransfers: string[];
  filteredTransfers: Transfer[];
  transferFilter: string;
  handleClientChange: (clientId: string) => void;
  handleTransferToggle: (transferId: string) => void;
  handleSelectAllTransfers: () => void;
  setTransferFilter: (value: string) => void;
  formatCurrency: (amount: number) => string;
}

export function FormContent({
  form,
  clients,
  loadingClients,
  isSubmitting,
  isCalculating,
  billPreview,
  selectedTransfers,
  filteredTransfers,
  transferFilter,
  handleClientChange,
  handleTransferToggle,
  handleSelectAllTransfers,
  setTransferFilter,
  formatCurrency,
}: FormContentProps) {
  return (
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

      {form.formState.errors.root && (
        <p className="text-sm font-medium text-destructive col-span-2">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button 
        type="submit" 
        className="w-full col-span-2" 
        disabled={loadingClients || isCalculating || selectedTransfers.length === 0 || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando...
          </>
        ) : isCalculating ? 'Calculando...' : 'Crear Factura'}
      </Button>
    </div>
  );
}
