
import React from 'react';
import { PaymentStatusBadge } from './PaymentStatusBadge';

export interface PaymentStatusCellProps {
  paymentStatus: string;
  onToggle?: () => void;
}

export function PaymentStatusCell({ paymentStatus, onToggle }: PaymentStatusCellProps) {
  const handleClick = onToggle ? (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  } : undefined;

  return (
    <div className="flex justify-center">
      <PaymentStatusBadge status={paymentStatus as 'paid' | 'pending'} onClick={handleClick} />
    </div>
  );
}
