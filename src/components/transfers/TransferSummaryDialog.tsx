
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Printer } from 'lucide-react';
import { getTransfer } from '@/hooks/transfers/operations/getTransfer';
import { Transfer } from '@/types';
import { Button } from '@/components/ui/button';
import {
  ClientInfoSection,
  ServiceDetailsSection,
  CollaboratorInfoSection,
  PricingDetailSection,
  ExpensesSection,
} from '@/components/transfers/wizard-steps/confirmation';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';
import { printTransferSummary } from '@/lib/exports/printTransferSummary';

interface TransferSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: string | null;
}

export function TransferSummaryDialog({
  isOpen,
  onClose,
  transferId
}: TransferSummaryDialogProps) {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTransferDetails() {
      if (!transferId || !isOpen) return;
      
      setLoading(true);
      try {
        const transferData = await getTransfer(transferId);
        if (transferData) {
          // The discountType and serviceType are already properly typed in the fetchTransferById function
          setTransfer(transferData as Transfer);
        }
      } catch (error) {
        console.error('Error fetching transfer details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransferDetails();
  }, [transferId, isOpen]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handlePrint = () => {
    if (transfer) {
      printTransferSummary(transfer);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalles del Transfer</span>
            {!loading && transfer && (
              <Button variant="outline" size="sm" onClick={handlePrint} className="ml-auto">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Cargando detalles...</span>
          </div>
        ) : transfer ? (
          <div className="space-y-6 py-2">
            {transfer.client && (
              <ClientInfoSection client={transfer.client} />
            )}
            
            <ServiceDetailsSection values={{
              serviceType: transfer.serviceType,
              date: transfer.date,
              time: transfer.time,
              origin: transfer.origin,
              destination: transfer.destination,
              hours: transfer.hours,
              paymentStatus: transfer.paymentStatus
            }} />
            
            {transfer.collaborator && (
              <CollaboratorInfoSection 
                values={{
                  collaborator: transfer.collaborator,
                  commission: transfer.commission,
                  commissionType: transfer.commissionType
                }} 
                commissionAmountEuros={calculateCommissionAmount(transfer)} 
                formatCurrency={formatCurrency} 
              />
            )}
            
            {/* Show expenses if any exist */}
            {transfer.expenses && transfer.expenses.length > 0 && (
              <ExpensesSection 
                expenses={transfer.expenses} 
                formatCurrency={formatCurrency} 
              />
            )}
            
            {/* Calculate pricing details */}
            {(() => {
              // Calculate base price (considering service type)
              const basePrice = transfer.serviceType === 'dispo'
                ? Number(transfer.price) * Number(transfer.hours || 1)
                : Number(transfer.price);
              
              // Calculate extras total
              const validExtraCharges = transfer.extraCharges || [];
              const totalExtraCharges = validExtraCharges.reduce((sum, charge) => {
                return sum + (typeof charge.price === 'number' ? charge.price : Number(charge.price) || 0);
              }, 0);
              
              // Calculate discount amount
              let discountAmount = 0;
              if (transfer.discountType && transfer.discountValue) {
                if (transfer.discountType === 'percentage') {
                  discountAmount = basePrice * (Number(transfer.discountValue) / 100);
                } else {
                  discountAmount = Number(transfer.discountValue);
                }
              }
              
              // Subtotal after discount
              const subtotalAfterDiscount = basePrice + totalExtraCharges - discountAmount;
              
              // Calculate commission amount
              const commissionAmountEuros = calculateCommissionAmount(transfer);
              
              // Final total
              const totalPrice = calculateTotalPrice(transfer) - commissionAmountEuros;
              
              return (
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
                  formatCurrency={formatCurrency}
                />
              );
            })()}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No se pudieron cargar los detalles del transfer
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
