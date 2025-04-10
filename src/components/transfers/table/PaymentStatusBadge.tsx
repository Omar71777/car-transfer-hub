
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { capitalizeFirstLetter } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: 'paid' | 'pending';
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const isMobile = useIsMobile();
  
  if (status === 'paid') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
        {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('cobrado')}</span>}
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800">
      <XCircle className="h-3 w-3 md:h-4 md:w-4" />
      {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('pendiente')}</span>}
    </div>
  );
}
