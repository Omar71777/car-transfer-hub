
import React from 'react';
import { Banknote, CreditCard, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PaymentMethod = 'card' | 'cash' | 'bank_transfer';

interface PaymentMethodIconProps {
  method: PaymentMethod;
  className?: string;
}

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  card: CreditCard,
  cash: Banknote,
  bank_transfer: Building2,
};

export function PaymentMethodIcon({ method, className }: PaymentMethodIconProps) {
  const Icon = PAYMENT_METHOD_ICONS[method];
  if (!Icon) return null;
  
  return <Icon className={className} />;
}
