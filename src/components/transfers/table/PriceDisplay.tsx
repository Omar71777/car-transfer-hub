
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateTotalPrice, calculateBasePrice } from '@/lib/calculations';
import { MinimalTransfer } from '@/lib/calculations';

interface PriceDisplayProps {
  transfer: MinimalTransfer;
}

export function PriceDisplay({ transfer }: PriceDisplayProps) {
  // Calculate the total price including extra charges and discounts
  const totalPrice = calculateTotalPrice(transfer);
  
  return (
    <div className="text-right font-medium whitespace-nowrap text-xs">
      {formatCurrency(totalPrice)}
    </div>
  );
}
