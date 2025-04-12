
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { capitalizeFirstLetter } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: 'paid' | 'pending';
  onClick?: () => void;
}

export function PaymentStatusBadge({ status, onClick }: PaymentStatusBadgeProps) {
  const isMobile = useIsMobile();
  const isClickable = !!onClick;
  
  const badgeClassName = `inline-flex items-center gap-1 px-2 py-1 rounded-full ${
    status === 'paid' 
      ? 'bg-pine/30 text-pine-dark' 
      : 'bg-sand/30 text-sand-dark'
  } ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`;
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };
  
  if (status === 'paid') {
    return (
      <div className={badgeClassName} onClick={handleClick}>
        <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
        {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('cobrado')}</span>}
      </div>
    );
  }
  
  return (
    <div className={badgeClassName} onClick={handleClick}>
      <XCircle className="h-3 w-3 md:h-4 md:w-4" />
      {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('pendiente')}</span>}
    </div>
  );
}
