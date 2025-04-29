
import React, { useEffect, useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Printer } from 'lucide-react';
import { getTransfer } from '@/hooks/transfers/operations/getTransfer';
import { Transfer } from '@/types';
import { Button } from '@/components/ui/button';
import { ClientInfoSection, ServiceDetailsSection, CollaboratorInfoSection, PricingDetailSection, ExpensesSection } from '@/components/transfers/wizard-steps/confirmation';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';
import { printTransferSummary } from '@/lib/exports/transfer-summary';
import { useDialog } from '@/components/ui/dialog-service';

interface TransferSummaryContentProps {
  transferId: string;
  onClose: () => void;
}

export function TransferSummaryContent({
  transferId,
  onClose
}: TransferSummaryContentProps) {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch transfer details when dialog opens
  useEffect(() => {
    async function fetchTransferDetails() {
      if (!transferId) return;
      setLoading(true);
      try {
        const transferData = await getTransfer(transferId);
        if (transferData) {
          setTransfer(transferData as Transfer);
        }
      } catch (error) {
        console.error('Error fetching transfer details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTransferDetails();
  }, [transferId]);

  const handlePrint = () => {
    if (transfer) {
      document.body.style.pointerEvents = 'auto';
      printTransferSummary(transfer);

      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-xl font-semibold">Detalles del Transfer</span>
          {!loading && transfer && <Button variant="outline" size="sm" onClick={handlePrint} className="ml-auto hover:bg-primary/10">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>}
        </DialogTitle>
        <DialogDescription>
          Revisa los detalles completos del transfer seleccionado.
        </DialogDescription>
      </DialogHeader>

      {loading ? <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando detalles...</span>
        </div> : transfer ? <div className="space-y-6 py-2 animate-fade-in">
          {transfer.client && <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <ClientInfoSection client={transfer.client} />
            </div>}
          
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <ServiceDetailsSection values={{
              serviceType: transfer.serviceType,
              date: transfer.date,
              time: transfer.time,
              origin: transfer.origin,
              destination: transfer.destination,
              hours: transfer.hours,
              paymentStatus: transfer.paymentStatus
            }} />
          </div>
          
          {transfer.collaborator && <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <CollaboratorInfoSection values={{
                collaborator: transfer.collaborator,
                commission: transfer.commission,
                commissionType: transfer.commissionType
              }} commissionAmountEuros={calculateCommissionAmount(transfer)} formatCurrency={amount => new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR'
              }).format(amount)} />
            </div>}
          
          {transfer.expenses && transfer.expenses.length > 0 && <ExpensesSection expenses={transfer.expenses} formatCurrency={amount => new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(amount)} />}
          
          {(() => {
            // Calculate pricing details
            const basePrice = transfer.serviceType === 'dispo' ? Number(transfer.price) * Number(transfer.hours || 1) : Number(transfer.price);
            const validExtraCharges = transfer.extraCharges || [];
            const totalExtraCharges = validExtraCharges.reduce((sum, charge) => {
              return sum + (typeof charge.price === 'number' ? charge.price : Number(charge.price) || 0);
            }, 0);
            let discountAmount = 0;
            if (transfer.discountType && transfer.discountValue) {
              if (transfer.discountType === 'percentage') {
                discountAmount = basePrice * (Number(transfer.discountValue) / 100);
              } else {
                discountAmount = Number(transfer.discountValue);
              }
            }
            const subtotalAfterDiscount = basePrice + totalExtraCharges - discountAmount;
            const commissionAmountEuros = calculateCommissionAmount(transfer);
            const totalPrice = calculateTotalPrice(transfer);

            return <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <PricingDetailSection 
                values={{
                  serviceType: transfer.serviceType,
                  price: transfer.price,
                  hours: transfer.hours,
                  discountType: transfer.discountType,
                  discountValue: transfer.discountValue,
                  collaborator: transfer.collaborator,
                  commission: transfer.commission,
                  commissionType: transfer.commissionType
                }} 
                basePrice={basePrice}
                validExtraCharges={validExtraCharges}
                totalExtraCharges={totalExtraCharges}
                discountAmount={discountAmount}
                subtotalAfterDiscount={subtotalAfterDiscount}
                commissionAmountEuros={commissionAmountEuros}
                totalPrice={totalPrice}
                formatCurrency={amount => new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(amount)}
              />
            </div>;
          })()}
        </div> : <div className="py-8 text-center text-muted-foreground">
          No se pudieron cargar los detalles del transfer
        </div>}
    </>
  );
}

// Function to open the dialog using the dialog service
export function openTransferSummaryDialog(
  dialogService: ReturnType<typeof useDialog>,
  transferId: string,
  onClose?: () => void
) {
  const { openDialog, closeDialog } = dialogService;
  
  openDialog(
    <TransferSummaryContent
      transferId={transferId}
      onClose={() => {
        closeDialog();
        if (onClose) onClose();
      }}
    />,
    {
      width: 'md',
      preventOutsideClose: false,
      onClose: () => {
        console.log('Summary dialog closed');
        document.body.style.pointerEvents = 'auto';
        if (onClose) onClose();
      }
    }
  );
}
