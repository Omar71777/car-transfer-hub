
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Transfer } from '@/types';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import { PriceDisplay } from './PriceDisplay';
import { PaymentStatusCell } from './PaymentStatusCell';
import { TransferRowActions } from './TransferRowActions';
import { TruncatedCell } from './TruncatedCell';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  selected: boolean;
  onSelectRow: (id: string, selected: boolean) => void;
}

export function TransferTableRow({
  transfer,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  selected,
  onSelectRow
}: TransferTableRowProps) {
  const isMobile = useIsMobile();
  
  // Check if transfer has all required properties
  if (!transfer || !transfer.id) {
    console.error('Invalid transfer data:', transfer);
    return null;
  }

  // Get price including extras and discounts
  const totalPrice = calculateTotalPrice(transfer);
  
  // Calculate commission amount based on the correct formula for each service type
  const commissionAmount = calculateCommissionAmount(transfer);
  
  // Calculate total after commission
  const totalAfterCommission = totalPrice - commissionAmount;
  
  const formattedCommission = `${transfer.commission}% (${formatCurrency(commissionAmount)})`;

  return (
    <TableRow className={selected ? 'bg-accent/20' : undefined}>
      <TableCell className="px-1">
        <Checkbox 
          checked={selected} 
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)} 
          aria-label="Select row"
        />
      </TableCell>
      <TableCell className="text-xs truncate-cell">{transfer.date || 'N/A'}</TableCell>
      <TableCell>
        <ServiceTypeBadge serviceType={transfer.serviceType} hours={transfer.hours} />
      </TableCell>
      <TableCell className="text-right">
        <PriceDisplay 
          price={totalPrice} 
          discountType={transfer.discountType} 
          discountValue={transfer.discountValue} 
        />
      </TableCell>
      {!isMobile && (
        <TableCell>
          <TruncatedCell text={transfer.client?.name} />
        </TableCell>
      )}
      {!isMobile && (
        <TableCell>
          <TruncatedCell text={transfer.collaborator} />
        </TableCell>
      )}
      {!isMobile && <TableCell className="text-right whitespace-nowrap text-xs">{formattedCommission}</TableCell>}
      {!isMobile && <TableCell className="text-right whitespace-nowrap text-xs">{formatCurrency(totalAfterCommission)}</TableCell>}
      <TableCell className="text-center p-1">
        <PaymentStatusCell paymentStatus={transfer.paymentStatus} />
      </TableCell>
      <TableCell className="py-0 px-1 table-actions">
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
