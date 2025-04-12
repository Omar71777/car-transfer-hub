
import React, { useMemo } from 'react';
import { ClientInfoSection } from './ClientInfoSection';
import { ServiceDetailSection } from './ServiceDetailSection';
import { CollaboratorInfoSection } from './CollaboratorInfoSection';
import { PricingDetailSection } from './PricingDetailSection';
import { useTransferForm } from '../../context/TransferFormContext';
import { formatCurrency } from '@/lib/format';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ConfirmationScreenProps {
  formState: any;
  clients: any[];
}

export function ConfirmationScreen({ formState, clients }: ConfirmationScreenProps) {
  const { isServicioPropio } = useTransferForm();
  const isMobile = useIsMobile();
  
  // Get client from the clients array
  const client = clients.find(c => c.id === formState.clientId);
  
  // Calculate base price (price * hours for dispo)
  const basePrice = useMemo(() => {
    const price = Number(formState.price);
    if (formState.serviceType === 'dispo' && formState.hours) {
      return price * Number(formState.hours);
    }
    return price;
  }, [formState.price, formState.serviceType, formState.hours]);
  
  // Filter only valid extra charges
  const validExtraCharges = useMemo(() => {
    return (formState.extraCharges || []).filter(
      (charge: any) => charge && charge.name && charge.price
    );
  }, [formState.extraCharges]);
  
  // Calculate total extra charges
  const totalExtraCharges = useMemo(() => {
    return validExtraCharges.reduce(
      (sum: number, charge: any) => sum + Number(charge.price), 
      0
    );
  }, [validExtraCharges]);
  
  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (!formState.discountType || !formState.discountValue) return 0;
    
    const discountValue = Number(formState.discountValue);
    
    if (formState.discountType === 'percentage') {
      return (basePrice * discountValue) / 100;
    } else {
      return discountValue;
    }
  }, [formState.discountType, formState.discountValue, basePrice]);
  
  // Calculate subtotal (base price - discount + extra charges)
  const subtotalAfterDiscount = useMemo(() => {
    return basePrice - discountAmount + totalExtraCharges;
  }, [basePrice, discountAmount, totalExtraCharges]);
  
  // Calculate commission amount in euros
  const commissionAmountEuros = useMemo(() => {
    if (!formState.commission) return 0;
    
    const commission = Number(formState.commission);
    
    if (formState.commissionType === 'percentage') {
      return (subtotalAfterDiscount * commission) / 100;
    } else {
      return commission;
    }
  }, [formState.commission, formState.commissionType, subtotalAfterDiscount]);
  
  // Calculate total price (subtotal - commission)
  const totalPrice = useMemo(() => {
    return subtotalAfterDiscount - commissionAmountEuros;
  }, [subtotalAfterDiscount, commissionAmountEuros]);
  
  return (
    <div className={`space-y-6 ${isMobile ? 'text-sm' : ''}`}>
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Resumen del Transfer</h2>
        
        <div className="space-y-6">
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
        <div className="text-sm text-blue-700 italic">
          Este servicio está configurado como servicio propio. No se aplicarán comisiones.
        </div>
      )}
    </div>
  );
}
