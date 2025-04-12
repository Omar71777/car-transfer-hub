
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClientInfoSection,
  ServiceDetailsSection,
  CollaboratorInfoSection,
  PricingDetailSection,
  ConfirmationHeader
} from './confirmation';

interface ConfirmationStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ConfirmationStep({ clients, collaborators, formState }: ConfirmationStepProps) {
  const { getValues } = useFormContext();
  const values = getValues();
  
  // Debug log to see form values at confirmation step
  useEffect(() => {
    console.log('Confirmation step rendered with form values:', values);
  }, [values]);
  
  const client = clients?.find(c => c.id === values.clientId);
  const extraCharges = values.extraCharges || [];
  const validExtraCharges = extraCharges.filter((charge: any) => 
    charge.name && charge.price && charge.name.trim() !== '' && Number(charge.price) > 0
  );
  
  // Calculate total for extra charges
  const totalExtraCharges = validExtraCharges.reduce((sum: number, charge: any) => {
    return sum + (Number(charge.price) || 0);
  }, 0);
  
  // Calculate base price (considering service type)
  const basePrice = values.serviceType === 'dispo'
    ? Number(values.price) * Number(values.hours || 1)
    : Number(values.price);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (values.discountType && values.discountValue) {
    if (values.discountType === 'percentage') {
      discountAmount = basePrice * (Number(values.discountValue) / 100);
    } else {
      discountAmount = Number(values.discountValue);
    }
  }
  
  // Subtotal after discount
  const subtotalAfterDiscount = basePrice + totalExtraCharges - discountAmount;
  
  // Calculate commission amount in euros
  let commissionAmountEuros = 0;
  if (values.collaborator && values.collaborator !== 'none' && values.commission) {
    if (values.commissionType === 'percentage') {
      commissionAmountEuros = subtotalAfterDiscount * (Number(values.commission) / 100);
    } else {
      commissionAmountEuros = Number(values.commission);
    }
  }
  
  // Final total price after commission is deducted
  const totalPrice = subtotalAfterDiscount - commissionAmountEuros;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <ConfirmationHeader />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <ClientInfoSection client={client} />
            
            <ServiceDetailsSection values={values} />
            
            <CollaboratorInfoSection 
              values={values} 
              commissionAmountEuros={commissionAmountEuros} 
              formatCurrency={formatCurrency} 
            />
            
            <PricingDetailSection 
              values={values}
              basePrice={basePrice}
              validExtraCharges={validExtraCharges}
              totalExtraCharges={totalExtraCharges}
              discountAmount={discountAmount}
              subtotalAfterDiscount={subtotalAfterDiscount}
              commissionAmountEuros={commissionAmountEuros}
              totalPrice={totalPrice}
              formatCurrency={formatCurrency}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
