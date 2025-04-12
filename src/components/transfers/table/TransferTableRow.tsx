
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Transfer } from '@/types';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/format';
import { PaymentStatusCell } from './PaymentStatusCell';
import { TruncatedCell } from './TruncatedCell';
import { TransferRowActions } from './TransferRowActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  selected: boolean;
  onSelectRow: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string) => void;
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

  return (
    <TableRow>
      <TableCell className="w-10">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => {
            onSelectRow(transfer.id, !!checked);
          }}
        />
      </TableCell>
      <TableCell className="font-medium">{formatDate(transfer.date)}</TableCell>
      <TableCell>{transfer.time || '-'}</TableCell>
      <TableCell><ServiceTypeBadge type={transfer.serviceType} /></TableCell>
      <TableCell><TruncatedCell text={transfer.origin} /></TableCell>
      <TableCell><TruncatedCell text={transfer.destination} /></TableCell>
      <TableCell className="font-medium">
        {formatCurrency(transfer.price)}
        {transfer.serviceType === 'dispo' && transfer.hours && (
          <span className="text-xs text-muted-foreground ml-1">
            ({transfer.hours}h)
          </span>
        )}
      </TableCell>
      <TableCell><PaymentStatusCell status={transfer.paymentStatus} /></TableCell>
      <TableCell className="text-right">
        <TransferRowActions
          transferId={transfer.id}
          isMobile={false}
          onEdit={() => onEdit(transfer)}
          onDelete={() => onDelete(transfer.id)}
          onAddExpense={() => onAddExpense(transfer.id)}
          onViewSummary={() => onViewSummary(transfer.id)}
          onMarkAsPaid={() => onMarkAsPaid && onMarkAsPaid(transfer.id)}
        />
      </TableCell>
    </TableRow>
  );
}
