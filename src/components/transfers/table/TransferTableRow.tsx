
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { truncate } from '@/lib/utils';
import { Transfer } from '@/types';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { PaymentStatusCell } from './PaymentStatusCell';
import { PriceDisplay } from './PriceDisplay';
import { TransferRowActions } from './TransferRowActions';
import { TruncatedCell } from './TruncatedCell';
import { cn } from '@/lib/utils';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  selected?: boolean;
  onSelectRow?: (id: string, selected: boolean) => void;
}

export function TransferTableRow({
  transfer,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  selected = false,
  onSelectRow
}: TransferTableRowProps) {
  const handleSelect = (checked: boolean) => {
    if (onSelectRow) {
      onSelectRow(transfer.id, checked);
    }
  };
  
  // Date formatting to show only day and month abbreviation
  const formattedDate = format(new Date(transfer.date), 'dd MMM', { locale: es });
  
  // Determine row background color based on service type
  const rowClass = cn(
    transfer.service_type === 'dispo' ? 'bg-purple-50 hover:bg-purple-100' : 'bg-pink-50 hover:bg-pink-100',
    selected && 'bg-primary/10'
  );
  
  // Use "Propio" if no collaborator is assigned
  const collaboratorName = transfer.collaborator_name || "Propio";
  
  return (
    <TableRow className={rowClass}>
      <TableCell className="p-2">
        {onSelectRow && (
          <Checkbox 
            checked={selected} 
            onCheckedChange={handleSelect}
            aria-label="Select row"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">{formattedDate}</TableCell>
      <TableCell>{format(new Date(transfer.time), 'HH:mm')}</TableCell>
      <TableCell>
        <ServiceTypeBadge serviceType={transfer.service_type} />
      </TableCell>
      <TableCell>
        <TruncatedCell value={transfer.pickup_location} maxWidth="max-w-[150px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell value={transfer.dropoff_location} maxWidth="max-w-[150px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell value={transfer.client_name} maxWidth="max-w-[100px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell value={collaboratorName} maxWidth="max-w-[100px]" />
      </TableCell>
      <TableCell>
        <PriceDisplay amount={transfer.price} />
      </TableCell>
      <TableCell>
        <PaymentStatusCell paymentStatus={transfer.payment_status || 'pending'} />
      </TableCell>
      <TableCell>
        <TransferRowActions 
          transferId={transfer.id} 
          onEdit={() => onEdit(transfer)} 
          onDelete={() => onDelete(transfer.id)}
          onAddExpense={() => onAddExpense(transfer.id)}
          onViewSummary={() => onViewSummary(transfer.id)}
        />
      </TableCell>
    </TableRow>
  );
}
