
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatusCellProps {
  paymentStatus: string;
}

export function PaymentStatusCell({ paymentStatus }: PaymentStatusCellProps) {
  if (paymentStatus === 'paid') {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center justify-center p-1 rounded-full bg-green-100/70 text-green-700">
          <CheckCircle className="h-3.5 w-3.5" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center justify-center p-1 rounded-full bg-amber-100/70 text-amber-700">
        <XCircle className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
