
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
}

export function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <div className="text-right font-medium whitespace-nowrap text-xs">
      {formatCurrency(price)}
    </div>
  );
}
