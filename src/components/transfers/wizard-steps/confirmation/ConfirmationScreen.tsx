import React, { useMemo } from 'react';
import { ClientInfoSection } from './ClientInfoSection';
import { ServiceDetailSection } from './ServiceDetailSection';
import { CollaboratorInfoSection } from './CollaboratorInfoSection';
import { PricingDetailSection } from './PricingDetailSection';
import { useTransferForm } from '../../context/TransferFormContext';
import { formatCurrency } from '@/lib/format';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateTotalPrice, calculateCommissionAmount, calculateBasePrice, calculateDiscountAmount, calculateExtraChargesTotal } from '@/lib/calculations';

export interface ConfirmationScreenProps {
  formState: any;
  clients: any[];
}

export function ConfirmationScreen({ formState, clients }: ConfirmationScreenProps) {
  const { isServicioPropio } = useTransferForm();
  const isMobile = useIsMobile();
  
  // Get client from the clients array
  const client = clients.find(c => c.id === formState.clientId);
  
  // Calculate base price
  const basePrice = useMemo(() => calculateBasePrice(formState), [formState]);
  
  // Filter only valid extra charges
  const validExtraCharges = useMemo(() => {
    return (formState.extraCharges || []).filter(
      (charge: any) => charge && charge.name && charge.price
    );
  }, [formState.extraCharges]);
  
  // Calculate total extra charges
  const totalExtraCharges = useMemo(() => 
    calculateExtraChargesTotal(validExtraCharges), [validExtraCharges]);
  
  // Calculate discount amount
  const discountAmount = useMemo(() => 
    calculateDiscountAmount(formState), [formState]);
  
  // Calculate subtotal (base price - discount + extra charges)
  const subtotalAfterDiscount = useMemo(() => {
    return basePrice - discountAmount + totalExtraCharges;
  }, [basePrice, discountAmount, totalExtraCharges]);
  
  // Calculate commission amount in euros
  const commissionAmountEuros = useMemo(() => 
    calculateCommissionAmount(formState), [formState]);
  
  // Calculate total price using the unified calculation
  const totalPrice = useMemo(() => 
    calculateTotalPrice(formState), [formState]);

  return (
    <div className={`space-y-4 ${isMobile ? 'text-sm' : ''}`}>
      <div className="bg-secondary/30 p-3 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Resumen del Transfer</h2>
        
        <div className="space-y-4">
          {/* Client Information */}
          <ClientInfoSection client={client} />
          
          {/* Service Details */}
          <ServiceDetailSection values={formState} />
          
          {/* Collaborator Information (if applicable) */}
          <CollaboratorInfoSection 
            values={formState} 
            commissionAmountEuros={commissionAmountEuros} 
            formatCurrency={formatCurrency}
          />
          
          {/* Pricing Details */}
          <PricingDetailSection 
            values={formState}
            basePrice={basePrice}
            validExtraCharges={validExtraCharges}
            totalExtraCharges={totalExtraCharges}
            discountAmount={discountAmount}
            subtotalAfterDiscount={subtotalAfterDiscount}
            commissionAmountEuros={commissionAmountEuros}
            totalPrice={totalPrice}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
      
      {isServicioPropio && (
        <div className="text-xs text-blue-700 italic">
          Este servicio está configurado como servicio propio. No se aplicarán comisiones.
        </div>
      )}
    </div>
  );
}
