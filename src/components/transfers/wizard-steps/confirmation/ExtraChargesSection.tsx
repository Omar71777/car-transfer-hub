
import React from 'react';

interface ExtraChargesSectionProps {
  validExtraCharges: any[];
  totalExtraCharges: number;
  formatCurrency: (amount: number) => string;
}

export function ExtraChargesSection({ 
  validExtraCharges, 
  totalExtraCharges, 
  formatCurrency 
}: ExtraChargesSectionProps) {
  if (validExtraCharges.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {/* 4. Extra Charges */}
      {validExtraCharges.map((charge: any, index: number) => (
        <div key={index} className="flex justify-between">
          <p className="text-sm">{charge.name}</p>
          <p>{formatCurrency(Number(charge.price) || 0)}</p>
        </div>
      ))}
      
      {/* 5. Subtotal extra charges */}
      <div className="flex justify-between font-medium">
        <p className="text-sm">Subtotal cargos extra</p>
        <p>{formatCurrency(totalExtraCharges)}</p>
      </div>
    </div>
  );
}
