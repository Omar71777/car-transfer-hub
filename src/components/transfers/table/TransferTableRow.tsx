
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transfer } from '@/types';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { PaymentStatusCell } from './PaymentStatusCell';
import { PriceDisplay } from './PriceDisplay';
import { TransferRowActions } from './TransferRowActions';
import { TruncatedCell } from './TruncatedCell';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const handleSelect = (checked: boolean) => {
    if (onSelectRow) {
      onSelectRow(transfer.id, checked);
    }
  };
  
  // Date formatting to show only day and month abbreviation
  const formattedDate = format(new Date(transfer.date), 'dd MMM', { locale: es });
  
  // Determine row background color based on service type
  const rowClass = cn(
    transfer.serviceType === 'dispo' ? 'bg-purple-50 hover:bg-purple-100' : 'bg-pink-50 hover:bg-pink-100',
    selected && 'bg-primary/10'
  );
  
  // Use "Propio" if no collaborator is assigned
  const collaboratorName = transfer.collaborator || "Propio";
  
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
        <ServiceTypeBadge serviceType={transfer.serviceType} />
      </TableCell>
      <TableCell>
        <TruncatedCell text={transfer.origin} maxWidth="max-w-[150px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell text={transfer.destination || ''} maxWidth="max-w-[150px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell text={transfer.client?.name || ''} maxWidth="max-w-[100px]" />
      </TableCell>
      <TableCell>
        <TruncatedCell text={collaboratorName} maxWidth="max-w-[100px]" />
      </TableCell>
      <TableCell>
        <PriceDisplay price={transfer.price} />
      </TableCell>
      <TableCell>
        <PaymentStatusCell paymentStatus={transfer.paymentStatus || 'pending'} />
      </TableCell>
      <TableCell>
        <TransferRowActions 
          transferId={transfer.id} 
          isMobile={isMobile}
          onEdit={() => onEdit(transfer)} 
          onDelete={() => onDelete(transfer.id)}
          onAddExpense={() => onAddExpense(transfer.id)}
          onViewSummary={() => onViewSummary(transfer.id)}
        />
      </TableCell>
    </TableRow>
  );
}
