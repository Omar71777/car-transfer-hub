
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: 'paid' | 'pending';
  onClick?: (e?: React.MouseEvent) => void;
}

export function PaymentStatusBadge({ status, onClick }: PaymentStatusBadgeProps) {
  return (
    <Badge
      variant={status === 'paid' ? "success" : "secondary"}
      className={`text-xs px-1.5 py-0 cursor-${onClick ? 'pointer' : 'default'}`}
      onClick={onClick && ((e) => onClick(e))}
    >
      {status === 'paid' ? 'Cobrado' : 'Pendiente'}
    </Badge>
  );
}
