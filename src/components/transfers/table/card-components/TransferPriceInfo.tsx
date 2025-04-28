
import React from 'react';
import { Transfer } from '@/types';
import { PriceDisplay } from '../PriceDisplay';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/format';

interface TransferPriceInfoProps {
  transfer: Transfer;
}

export function TransferPriceInfo({ transfer }: TransferPriceInfoProps) {
  // Safe check for valid transfer pricing data
  const hasDiscount = transfer.discountValue !== undefined && 
                     transfer.discountValue !== null && 
                     transfer.discountValue > 0;

  return (
    <div className="col-span-2 mt-1 grid grid-cols-2 gap-x-3">
      <div>
        <div className="flex items-center gap-1">
          <p className="text-xs font-medium text-muted-foreground">Precio Total:</p>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Incluye cargos extra, descuentos y comisiones</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <PriceDisplay transfer={transfer} />
      </div>
      
      <div>
        {hasDiscount && (
          <>
            <p className="text-xs font-medium text-muted-foreground">Descuento:</p>
            <p className="text-xs text-emerald-600 font-medium">
              {transfer.discountType === 'percentage' 
                ? `${transfer.discountValue}%` 
                : formatCurrency(Number(transfer.discountValue))}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
