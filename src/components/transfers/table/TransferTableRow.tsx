
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Transfer } from '@/types';
import { Edit2, Trash2, Receipt, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransferTableRowProps {
  transfer: Transfer;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  selected: boolean;
  onSelectRow: (id: string, selected: boolean) => void;
}

export function TransferTableRow({
  transfer,
  onEdit,
  onDelete,
  onAddExpense,
  selected,
  onSelectRow
}: TransferTableRowProps) {
  const isMobile = useIsMobile();
  
  // Check if transfer has all required properties
  if (!transfer || !transfer.id) {
    console.error('Invalid transfer data:', transfer);
    return null;
  }

  // Format discount for display
  const formatDiscount = () => {
    if (!transfer.discountType || !transfer.discountValue) return null;
    
    if (transfer.discountType === 'percentage') {
      return `${transfer.discountValue}%`;
    } else {
      return formatCurrency(transfer.discountValue);
    }
  };

  // Get price including extras and discounts
  const totalPrice = calculateTotalPrice(transfer);
  
  // Calculate commission amount based on the correct formula for each service type
  const commissionAmount = calculateCommissionAmount(transfer);
  const formattedCommission = `${transfer.commission}% (${formatCurrency(commissionAmount)})`;

  // Format service type display
  const serviceTypeDisplay = () => {
    if (transfer.serviceType === 'dispo') {
      return `Dispo ${transfer.hours || 0}h`;
    }
    return 'Transfer';
  };

  return (
    <TableRow className={selected ? 'bg-accent/20' : undefined}>
      <TableCell>
        <Checkbox 
          checked={selected} 
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)} 
          aria-label="Select row"
        />
      </TableCell>
      <TableCell>{transfer.date || 'N/A'}</TableCell>
      {!isMobile && <TableCell>{transfer.time || 'N/A'}</TableCell>}
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {serviceTypeDisplay()}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[120px] truncate" title={transfer.origin}>
        {transfer.origin || 'N/A'}
      </TableCell>
      <TableCell className="max-w-[120px] truncate" title={transfer.destination}>
        {transfer.destination || 'N/A'}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(totalPrice)}
        {transfer.discountType && Number(transfer.discountValue) > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block ml-1">
                  <Tag className="h-3.5 w-3.5 text-green-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Descuento: {formatDiscount()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
      {!isMobile && (
        <TableCell className="max-w-[120px] truncate" title={transfer.client?.name}>
          {transfer.client?.name || 'N/A'}
        </TableCell>
      )}
      {!isMobile && <TableCell>{transfer.collaborator || 'N/A'}</TableCell>}
      {!isMobile && <TableCell className="text-right">{formattedCommission}</TableCell>}
      <TableCell className="text-center">
        <Badge 
          variant={transfer.paymentStatus === 'paid' ? 'success' : 'outline'}
          className="text-xs whitespace-nowrap"
        >
          {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAddExpense(transfer.id)}
            className="h-8 w-8"
          >
            <Receipt className="h-4 w-4" />
            <span className="sr-only">Añadir gasto</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(transfer)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(transfer.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
