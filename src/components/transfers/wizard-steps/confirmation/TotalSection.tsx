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
  return null;
}
