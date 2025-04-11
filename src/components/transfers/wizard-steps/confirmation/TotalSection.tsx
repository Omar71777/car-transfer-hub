
import React from 'react';

interface TotalSectionProps {
  values: any;
  discountAmount: number;
  subtotalAfterDiscount: number;
  commissionAmountEuros: number;
  totalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function TotalSection({ 
  values,
  discountAmount,
  subtotalAfterDiscount,
  commissionAmountEuros,
  totalPrice,
  formatCurrency
}: TotalSectionProps) {
  return (
    <div className="space-y-2">
      {values.discountType && values.discountValue && (
        <div className="flex justify-between text-green-600">
          <p className="text-sm">Descuento {values.discountType === 'percentage' ? `(${values.discountValue}%)` : ''}</p>
          <p>-{formatCurrency(discountAmount)}</p>
        </div>
      )}
      
      <div className="flex justify-between font-semibold pt-2 border-t">
        <p>Subtotal</p>
        <p>{formatCurrency(subtotalAfterDiscount)}</p>
      </div>
      
      {values.collaborator && values.collaborator !== 'none' && values.commission && (
        <div className="flex justify-between text-amber-600">
          <p className="text-sm">Comisión colaborador {values.commissionType === 'percentage' ? `(${values.commission}%)` : ''}</p>
          <p>-{formatCurrency(commissionAmountEuros)}</p>
        </div>
      )}
      
      <div className="flex justify-between font-bold pt-2 border-t">
        <p>TOTAL</p>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </div>
  );
}
