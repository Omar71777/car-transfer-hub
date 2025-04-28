
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PaymentStatusBadge } from '../PaymentStatusBadge';
import { PaymentMethodIcon } from '../../PaymentMethodIcon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Transfer } from '@/types';

interface TransferCardBadgesProps {
  transfer: Transfer;
  onSelectRow?: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string, newStatus?: 'paid' | 'pending') => void;
  isSelected?: boolean;
}

export function TransferCardBadges({ 
  transfer, 
  onSelectRow, 
  onMarkAsPaid,
  isSelected 
}: TransferCardBadgesProps) {
  const paymentMethodLabels = {
    card: 'Tarjeta',
    cash: 'Efectivo',
    bank_transfer: 'Transferencia'
  };

  const handleTogglePaymentStatus = () => {
    if (onMarkAsPaid) {
      const newStatus = transfer.paymentStatus === 'paid' ? 'pending' : 'paid';
      onMarkAsPaid(transfer.id, newStatus);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {onSelectRow && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => {
            onSelectRow(transfer.id, !!checked);
          }}
          className="mr-1"
        />
      )}
      
      <Badge 
        variant={transfer.serviceType === 'transfer' ? "default" : "secondary"}
        className="text-xs font-medium uppercase px-1.5 py-0"
      >
        {transfer.serviceType === 'transfer' ? 'Transfer' : 'Dispo'}
      </Badge>
      
      {onMarkAsPaid ? (
        <div onClick={(e) => {
          e.stopPropagation();
          handleTogglePaymentStatus();
        }}>
          <PaymentStatusBadge 
            status={transfer.paymentStatus as 'paid' | 'pending'} 
            onClick={handleTogglePaymentStatus}
          />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Badge 
            variant={transfer.paymentStatus === 'paid' ? "success" : "secondary"}
            className="text-xs px-1.5 py-0"
          >
            {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
          </Badge>
          {transfer.paymentStatus === 'paid' && transfer.payment_method && (
            <Tooltip>
              <TooltipTrigger>
                <PaymentMethodIcon 
                  method={transfer.payment_method} 
                  className="h-4 w-4 text-muted-foreground"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Pagado con {paymentMethodLabels[transfer.payment_method]}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      
      {transfer.billed && (
        <Badge variant="outline" className="text-xs px-1.5 py-0 bg-blue-100 text-blue-800">
          Facturado
        </Badge>
      )}
    </div>
  );
}
