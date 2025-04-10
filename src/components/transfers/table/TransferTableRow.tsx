
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency, capitalizeFirstLetter } from '@/lib/utils';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { TransferTableActions } from './TransferTableActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { RowCheckbox } from '@/components/ui/row-checkbox';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  selected?: boolean;
  onSelectRow?: (id: string, selected: boolean) => void;
}

export function TransferTableRow({
  transfer,
  onEdit,
  onDelete,
  onAddExpense,
  selected = false,
  onSelectRow
}: TransferTableRowProps) {
  const isMobile = useIsMobile();
  
  // Function to display commission value with appropriate format
  const formatCommission = (transfer: Transfer) => {
    if (transfer.commissionType === 'percentage') {
      return `${transfer.commission}% (${formatCurrency((transfer.price * transfer.commission) / 100)})`;
    } else {
      return `${formatCurrency(transfer.commission)} (${((transfer.commission / transfer.price) * 100).toFixed(1)}%)`;
    }
  };
  
  const handleSelectChange = (checked: boolean) => {
    if (onSelectRow) {
      onSelectRow(transfer.id, checked);
    }
  };
  
  return (
    <TableRow className={selected ? "bg-muted/30" : undefined}>
      <TableCell className="px-2">
        {onSelectRow && (
          <RowCheckbox 
            id={transfer.id}
            checked={selected} 
            onChange={handleSelectChange}
          />
        )}
      </TableCell>
      <TableCell>{transfer.date}</TableCell>
      {!isMobile && <TableCell>{transfer.time}</TableCell>}
      <TableCell className="max-w-[100px] truncate" title={capitalizeFirstLetter(transfer.origin)}>
        {capitalizeFirstLetter(transfer.origin)}
      </TableCell>
      <TableCell className="max-w-[100px] truncate" title={capitalizeFirstLetter(transfer.destination)}>
        {capitalizeFirstLetter(transfer.destination)}
      </TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(transfer.price)}</TableCell>
      {!isMobile && <TableCell className="max-w-[120px] truncate" title={transfer.client?.name || ''}>
        {transfer.client?.name || '-'}
      </TableCell>}
      {!isMobile && <TableCell>{capitalizeFirstLetter(transfer.collaborator || '-')}</TableCell>}
      {!isMobile && <TableCell className="text-right">
        {formatCommission(transfer)}
      </TableCell>}
      <TableCell className="text-center">
        <PaymentStatusBadge status={transfer.paymentStatus} />
      </TableCell>
      <TableCell>
        <TransferTableActions
          transfer={transfer}
          isMobile={isMobile}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExpense={onAddExpense}
        />
      </TableCell>
    </TableRow>
  );
}
