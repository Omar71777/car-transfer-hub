
import React from 'react';

interface PriceBaseSectionProps {
  values: any;
  basePrice: number;
  formatCurrency: (amount: number) => string;
}

export function PriceBaseSection({ values, basePrice, formatCurrency }: PriceBaseSectionProps) {
  return (
    <div className="space-y-2">
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
    </div>
  );
}
