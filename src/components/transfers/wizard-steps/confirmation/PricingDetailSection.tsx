
import React from 'react';
import { PriceBaseSection } from './PriceBaseSection';
import { ExtraChargesSection } from './ExtraChargesSection';
import { TotalSection } from './TotalSection';
import { SeparatorLine } from './SeparatorLine';

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
        {/* 1. Base Price */}
        <PriceBaseSection 
          values={values} 
          basePrice={basePrice} 
          formatCurrency={formatCurrency} 
        />
        
        {/* 2. Discount (moved from TotalSection) */}
        {values.discountType && values.discountValue && (
          <div className="flex justify-between text-green-600">
            <p className="text-sm">Descuento {values.discountType === 'percentage' ? `(${values.discountValue}%)` : ''}</p>
            <p>-{formatCurrency(discountAmount)}</p>
          </div>
        )}
        
        {/* 3. Separator */}
        <SeparatorLine />
        
        {/* 4-5. Extra Charges and Subtotal */}
        <ExtraChargesSection 
          validExtraCharges={validExtraCharges} 
          totalExtraCharges={totalExtraCharges} 
          formatCurrency={formatCurrency} 
        />
        
        {/* 6. Separator */}
        <SeparatorLine />
        
        {/* 7. Subtotal */}
        <div className="flex justify-between font-semibold">
          <p>Subtotal</p>
          <p>{formatCurrency(subtotalAfterDiscount)}</p>
        </div>
        
        {/* 8. Commission */}
        {values.collaborator && values.collaborator !== 'none' && values.commission && (
          <div className="flex justify-between text-amber-600">
            <p className="text-sm">Comisión colaborador {values.commissionType === 'percentage' ? `(${values.commission}%)` : ''}</p>
            <p>-{formatCurrency(commissionAmountEuros)}</p>
          </div>
        )}
        
        {/* 9. Separator */}
        <SeparatorLine />
        
        {/* 10. TOTAL */}
        <div className="flex justify-between font-bold">
          <p>TOTAL</p>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}
