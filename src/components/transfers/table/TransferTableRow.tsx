
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transfer } from '@/types';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { PaymentStatusCell } from './PaymentStatusCell';
import { PriceDisplay } from './PriceDisplay';
import { TransferRowActions } from './TransferRowActions';
import { TruncatedCell } from './TruncatedCell';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

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
  
  // Safely format the date with validation
  const getFormattedDate = () => {
    try {
      const dateObj = new Date(transfer.date);
      return isValid(dateObj) 
        ? format(dateObj, 'dd MMM', { locale: es }) 
        : 'Fecha inválida';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };
  
  // Determine row background color based on service type with more subtle colors
  const rowClass = cn(
    transfer.serviceType === 'dispo' ? 'bg-soft-green/40 hover:bg-soft-green/60' : 'bg-soft-blue/40 hover:bg-soft-blue/60',
    selected && 'bg-primary/10'
  );
  
  // Use "Propio" if no collaborator is assigned
  const collaboratorName = transfer.collaborator || "Propio";
  
  // Get the formatted date
  const formattedDate = getFormattedDate();
  
  // Calculate total price including extras and discounts
  const totalPrice = calculateTotalPrice(transfer);
  
  // Calculate commission based on the total price
  const commission = calculateCommissionAmount(transfer);
  
  // Calculate profit (total price minus commission)
  const profit = totalPrice - commission;
  
  return (
    <TableRow className={rowClass}>
      <TableCell className="p-1">
        {onSelectRow && (
          <Checkbox 
            checked={selected} 
            onCheckedChange={handleSelect}
            aria-label="Select row"
            className="h-3.5 w-3.5"
          />
        )}
      </TableCell>
      <TableCell className="font-medium text-xs text-center">{formattedDate}</TableCell>
      <TableCell className="text-center">
        <ServiceTypeBadge serviceType={transfer.serviceType} />
      </TableCell>
      <TableCell className="text-right">
        <PriceDisplay transfer={transfer} />
      </TableCell>
      {!isMobile && (
        <TableCell className="text-center">
          <TruncatedCell text={transfer.client?.name || ''} maxWidth="max-w-[100px]" />
        </TableCell>
      )}
      {!isMobile && (
        <TableCell className="text-center">
          <TruncatedCell text={collaboratorName} maxWidth="max-w-[100px]" />
        </TableCell>
      )}
      {!isMobile && (
        <TableCell className="text-right">
          <span className="text-xs font-medium">{profit.toFixed(2)}€</span>
        </TableCell>
      )}
      <TableCell className="text-center">
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
