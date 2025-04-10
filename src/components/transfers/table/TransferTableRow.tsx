
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Transfer } from '@/types';
import { Edit2, Trash2, Receipt, Car, Clock, Tag, PackagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Check if transfer has all required properties
  if (!transfer || !transfer.id) {
    console.error('Invalid transfer data:', transfer);
    return null;
  }

  // Calculate total with extras and discount
  const calculateTotal = () => {
    try {
      // Base price
      let basePrice = Number(transfer.price) || 0;
      
      // For dispo service, multiply by hours if available
      if (transfer.serviceType === 'dispo' && transfer.hours) {
        basePrice = basePrice * Number(transfer.hours);
      }
      
      // Add extra charges
      const extraChargesTotal = Array.isArray(transfer.extraCharges) 
        ? transfer.extraCharges.reduce(
            (sum, charge) => sum + (typeof charge.price === 'string' ? Number(charge.price) : (charge.price || 0)), 0
          )
        : 0;
      
      // Calculate discount
      let discountAmount = 0;
      if (transfer.discountType && transfer.discountValue) {
        if (transfer.discountType === 'percentage') {
          discountAmount = basePrice * (Number(transfer.discountValue) / 100);
        } else {
          discountAmount = Number(transfer.discountValue);
        }
      }
      
      // Calculate final total
      return basePrice + extraChargesTotal - discountAmount;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  };

  // Format discount for display
  const formatDiscount = () => {
    if (!transfer.discountType || !transfer.discountValue) return null;
    
    if (transfer.discountType === 'percentage') {
      return `${transfer.discountValue}%`;
    } else {
      return formatCurrency(transfer.discountValue);
    }
  };

  // Get total number of extra charges
  const extraChargesCount = Array.isArray(transfer.extraCharges) ? transfer.extraCharges.length : 0;

  return (
    <TableRow className={selected ? 'bg-accent/20' : undefined}>
      <TableCell>
        <Checkbox 
          checked={selected} 
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)} 
          aria-label="Select row"
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <div className="flex items-center">
            {transfer.serviceType === 'dispo' ? (
              <Clock className="h-4 w-4 mr-1 text-blue-500" />
            ) : (
              <Car className="h-4 w-4 mr-1 text-primary" />
            )}
            <span>
              {transfer.origin || 'N/A'} 
              {transfer.serviceType === 'transfer' && transfer.destination && (
                <> → {transfer.destination}</>
              )}
            </span>
          </div>
          {transfer.serviceType === 'dispo' && transfer.hours && (
            <span className="text-xs text-muted-foreground ml-5">
              {transfer.hours} horas
            </span>
          )}
          {transfer.client?.name && (
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {transfer.client.name}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{transfer.date || 'N/A'}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span>{formatCurrency(calculateTotal())}</span>
            {transfer.discountType && Number(transfer.discountValue) > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Tag className="h-3.5 w-3.5 text-green-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Descuento: {formatDiscount()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {extraChargesCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <PackagePlus className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{extraChargesCount} cargo{extraChargesCount !== 1 ? 's' : ''} extra{extraChargesCount !== 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Badge 
            variant={transfer.paymentStatus === 'paid' ? 'default' : 'outline'}
            className="text-xs"
          >
            {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
          </Badge>
        </div>
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
