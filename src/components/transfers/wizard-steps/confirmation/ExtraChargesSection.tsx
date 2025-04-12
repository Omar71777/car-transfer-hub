
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (!validExtraCharges.length) return null;
  
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">Cargos adicionales:</p>
      
      <div className={`space-y-1 pl-2 ${isMobile ? 'text-sm' : ''}`}>
        {validExtraCharges.map((charge, idx) => (
          <div key={idx} className="flex justify-between">
            <p className={`truncate max-w-[200px] ${isMobile ? 'text-xs' : 'text-sm'}`}>{charge.name}</p>
            <p>{formatCurrency(Number(charge.price))}</p>
          </div>
        ))}
      </div>
      
      {validExtraCharges.length > 0 && (
        <div className="flex justify-between font-medium pt-1">
          <p>Subtotal cargos extra</p>
          <p>{formatCurrency(totalExtraCharges)}</p>
        </div>
      )}
    </div>
  );
}
