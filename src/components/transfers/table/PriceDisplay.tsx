
import React from 'react';
import { Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PriceDisplayProps {
  price: number;
  discountType?: string;
  discountValue?: number;
}

export function PriceDisplay({ price, discountType, discountValue }: PriceDisplayProps) {
  // Format discount for display
  const formatDiscount = () => {
    if (!discountType || !discountValue) return null;
    
    if (discountType === 'percentage') {
      return `${discountValue}%`;
    } else {
      return formatCurrency(discountValue);
    }
  };

  const hasDiscount = discountType && Number(discountValue) > 0;

  return (
    <div className="text-right font-medium whitespace-nowrap text-xs">
      {formatCurrency(price)}
      {hasDiscount && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block ml-1">
                <Tag className="h-3 w-3 text-green-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Descuento: {formatDiscount()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
