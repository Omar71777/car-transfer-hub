
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PriceBaseSectionProps {
  values: any;
  basePrice: number;
  formatCurrency: (amount: number) => string;
}

export function PriceBaseSection({ 
  values, 
  basePrice, 
  formatCurrency 
}: PriceBaseSectionProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-1">
      {values.serviceType === 'dispo' ? (
        <>
          <div className="flex justify-between">
            <p className="text-sm">Precio por hora</p>
            <p>{formatCurrency(Number(values.price))}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Horas contratadas</p>
            <p>{values.hours} {isMobile ? 'h' : 'horas'}</p>
          </div>
          <div className="flex justify-between font-medium">
            <p>Precio base</p>
            <p>{formatCurrency(basePrice)}</p>
          </div>
        </>
      ) : (
        <div className="flex justify-between font-medium">
          <p>Precio base</p>
          <p>{formatCurrency(basePrice)}</p>
        </div>
      )}
    </div>
  );
}
