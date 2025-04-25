
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Transfer } from '@/types';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { PaymentStatusCell } from './PaymentStatusCell';
import { TruncatedCell } from './TruncatedCell';
import { TransferRowActions } from './TransferRowActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PriceDisplay } from './PriceDisplay';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  selected: boolean;
  onSelectRow: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string, newStatus?: 'paid' | 'pending') => void;
}

export function TransferTableRow({
  transfer,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  selected,
  onSelectRow,
  onMarkAsPaid
}: TransferTableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  const handleTogglePaymentStatus = () => {
    if (onMarkAsPaid) {
      const newStatus = transfer.paymentStatus === 'pending' ? undefined : 'pending';
      onMarkAsPaid(transfer.id, newStatus);
    }
  };

  return (
    <TableRow>
      <TableCell className="w-10">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)}
        />
      </TableCell>
      <TableCell className="font-medium">{formatDate(transfer.date)}</TableCell>
      <TableCell>{transfer.time || '-'}</TableCell>
      <TableCell><ServiceTypeBadge serviceType={transfer.serviceType} /></TableCell>
      <TableCell><TruncatedCell text={transfer.origin} /></TableCell>
      <TableCell><TruncatedCell text={transfer.destination} /></TableCell>
      <TableCell className="font-medium">
        <PriceDisplay transfer={transfer} />
        {transfer.serviceType === 'dispo' && transfer.hours && (
          <span className="text-xs text-muted-foreground ml-1">
            ({transfer.hours}h)
          </span>
        )}
      </TableCell>
      <TableCell>
        <PaymentStatusCell 
          paymentStatus={transfer.paymentStatus} 
          onToggle={onMarkAsPaid ? handleTogglePaymentStatus : undefined}
        />
      </TableCell>
      <TableCell className="text-right">
        <TransferRowActions
          transferId={transfer.id}
          isMobile={false}
          onEdit={() => onEdit(transfer)}
          onDelete={() => onDelete(transfer.id)}
          onAddExpense={() => onAddExpense(transfer.id)}
          onViewSummary={() => onViewSummary(transfer.id)}
          onMarkAsPaid={onMarkAsPaid && transfer.paymentStatus === 'pending' ? () => onMarkAsPaid(transfer.id) : undefined}
          onMarkAsUnpaid={onMarkAsPaid && transfer.paymentStatus === 'paid' ? () => onMarkAsPaid(transfer.id, 'pending') : undefined}
        />
      </TableCell>
    </TableRow>
  );
}
