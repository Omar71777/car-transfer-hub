
import React from 'react';
import { Banknote, CreditCard, Bank } from 'lucide-react';

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
      return <Bank className={className} />;
    default:
      return null;
  }
}
