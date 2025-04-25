
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateTotalPrice } from '@/lib/calculations';
import { Transfer } from '@/types';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  transfer: Transfer;
  className?: string;
}

export function PriceDisplay({ transfer, className }: PriceDisplayProps) {
  const totalPrice = calculateTotalPrice(transfer);
  
  return (
    <div className={cn("text-sm font-semibold text-emerald-700", className)}>
      {formatCurrency(totalPrice)}
    </div>
  );
}
