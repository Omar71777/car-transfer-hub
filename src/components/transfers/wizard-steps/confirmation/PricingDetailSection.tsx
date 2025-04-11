
import React from 'react';
import { PriceBaseSection } from './PriceBaseSection';
import { ExtraChargesSection } from './ExtraChargesSection';
import { TotalSection } from './TotalSection';

interface PricingDetailSectionProps {
  values: any;
  basePrice: number;
  validExtraCharges: any[];
  totalExtraCharges: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  commissionAmountEuros: number;
  totalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function PricingDetailSection({ 
  values,
  basePrice,
  validExtraCharges,
  totalExtraCharges,
  discountAmount,
  subtotalAfterDiscount,
  commissionAmountEuros,
  totalPrice,
  formatCurrency
}: PricingDetailSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-lg">Detalles del precio</h3>
      <div className="space-y-2 mt-2">
        <PriceBaseSection 
          values={values} 
          basePrice={basePrice} 
          formatCurrency={formatCurrency} 
        />
        
        <ExtraChargesSection 
          validExtraCharges={validExtraCharges} 
          totalExtraCharges={totalExtraCharges} 
          formatCurrency={formatCurrency} 
        />
        
        <TotalSection 
          values={values}
          discountAmount={discountAmount}
          subtotalAfterDiscount={subtotalAfterDiscount}
          commissionAmountEuros={commissionAmountEuros}
          totalPrice={totalPrice}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
