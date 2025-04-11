
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusCellProps {
  paymentStatus: string;
}

export function PaymentStatusCell({ paymentStatus }: PaymentStatusCellProps) {
  return (
    <Badge 
      variant={paymentStatus === 'paid' ? 'success' : 'outline'}
      className="text-xs whitespace-nowrap px-1.5 py-0"
    >
      {paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
    </Badge>
  );
}
