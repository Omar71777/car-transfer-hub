
import React from 'react';

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
        {values.serviceType === 'dispo' ? (
          <div className="flex justify-between">
            <p className="text-sm">Precio base ({values.price}€ × {values.hours} horas)</p>
            <p>{formatCurrency(basePrice)}</p>
          </div>
        ) : (
          <div className="flex justify-between">
            <p className="text-sm">Precio base</p>
            <p>{formatCurrency(basePrice)}</p>
          </div>
        )}
        
        {validExtraCharges.length > 0 && (
          <>
            {validExtraCharges.map((charge: any, index: number) => (
              <div key={index} className="flex justify-between">
                <p className="text-sm">{charge.name}</p>
                <p>{formatCurrency(Number(charge.price) || 0)}</p>
              </div>
            ))}
            <div className="flex justify-between font-medium pt-1">
              <p className="text-sm">Subtotal cargos extra</p>
              <p>{formatCurrency(totalExtraCharges)}</p>
            </div>
          </>
        )}
        
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
    </div>
  );
}
