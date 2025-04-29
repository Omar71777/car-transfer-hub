
import React from 'react';
import { Button } from '@/components/ui/button';
import { BillClientSection } from '../BillClientSection';
import { BillDateSection } from '../BillDateSection';
import { BillTaxSection } from '../BillTaxSection';
import { BillNotesSection } from '../BillNotesSection';
import { TransfersList } from '../TransfersList';
import { BillPreviewPanel } from '../BillPreviewPanel';
import { Loader, FilePlus2 } from 'lucide-react';
import { BillPreview } from '@/types/billing';
import { Client } from '@/types/client';
import { Transfer } from '@/types';
import { UseFormReturn } from 'react-hook-form';

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
  setTransferFilter: (filter: string) => void;
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
  formatCurrency
}: FormContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Detalles de la Factura</h2>
        
        <BillClientSection 
          form={form} 
          clients={clients} 
          onClientChange={handleClientChange}
          loadingClients={loadingClients}
        />
        
        <BillDateSection form={form} />
        
        <BillTaxSection form={form} />
        
        <BillNotesSection form={form} />
        
        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full"
            disabled={isSubmitting || selectedTransfers.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Creando factura...
              </>
            ) : (
              <>
                <FilePlus2 className="h-4 w-4 mr-2" />
                Crear Factura
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <TransfersList
          transfers={filteredTransfers}
          selectedTransfers={selectedTransfers}
          onTransferToggle={handleTransferToggle}
          onSelectAll={handleSelectAllTransfers}
          filter={transferFilter}
          onFilterChange={setTransferFilter}
          formatCurrency={formatCurrency}
        />
        
        <BillPreviewPanel
          billPreview={billPreview}
          isCalculating={isCalculating}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
