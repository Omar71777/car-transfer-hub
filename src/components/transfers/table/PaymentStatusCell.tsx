
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentStatusCellProps {
  paymentStatus: string;
}

export function PaymentStatusCell({ paymentStatus }: PaymentStatusCellProps) {
  const isMobile = useIsMobile();
  
  if (paymentStatus === 'paid') {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
          <CheckCircle className="h-4 w-4" />
          {!isMobile && <span className="text-xs font-medium">Cobrado</span>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700">
        <XCircle className="h-4 w-4" />
        {!isMobile && <span className="text-xs font-medium">Pendiente</span>}
      </div>
    </div>
  );
}
