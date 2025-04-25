
import React from 'react';
import { Banknote, CreditCard, Ban } from 'lucide-react';

type PaymentMethod = 'card' | 'cash' | 'bank_transfer';

interface PaymentMethodIconProps {
  method: PaymentMethod;
  className?: string;
}

export function PaymentMethodIcon({ method, className }: PaymentMethodIconProps) {
  switch (method) {
    case 'card':
      return <CreditCard className={className} />;
    case 'cash':
      return <Banknote className={className} />;
    case 'bank_transfer':
      return <Ban className={className} />; // Changed from Bank to Ban
    default:
      return null;
  }
}
