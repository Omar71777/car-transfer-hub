
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Transfer } from '@/types';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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

  // Format date to show only day and month abbreviation (e.g., "15 mar")
  const formattedDate = format(new Date(transfer.date), 'dd MMM', { locale: es });

  // Get collaborator name, use "Propio" if missing
  const collaboratorName = transfer.collaborator && transfer.collaborator.trim() !== '' 
    ? transfer.collaborator 
    : 'Propio';

  // Determine row background color based on service type
  const rowBgClass = transfer.serviceType === 'dispo' 
    ? 'bg-purple-50 hover:bg-purple-100' 
    : 'bg-pink-50 hover:bg-pink-100';

  return (
    <TableRow 
      className={selected ? 'bg-accent/20' : rowBgClass}
    >
      <TableCell className="px-1">
        <Checkbox 
          checked={selected} 
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)} 
          aria-label="Select row"
        />
      </TableCell>
      <TableCell className="text-xs truncate-cell">{formattedDate}</TableCell>
      <TableCell>
        <ServiceTypeBadge serviceType={transfer.serviceType} />
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
          <TruncatedCell text={collaboratorName} />
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
