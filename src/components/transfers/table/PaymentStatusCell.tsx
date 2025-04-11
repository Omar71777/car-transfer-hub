
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusCellProps {
  paymentStatus: string;
}

export function PaymentStatusCell({ paymentStatus }: PaymentStatusCellProps) {
  return (
    <Badge 
      variant={paymentStatus === 'paid' ? 'success' : 'outline'}
      className="text-xs whitespace-nowrap"
    >
      {paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
    </Badge>
  );
}
