
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Transfer } from '@/types';
import { Edit2, Trash2, Receipt, Tag, FileText, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      <TableCell className="px-1">
        <Checkbox 
          checked={selected} 
          onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)} 
          aria-label="Select row"
        />
      </TableCell>
      <TableCell>{transfer.date || 'N/A'}</TableCell>
      {!isMobile && <TableCell>{transfer.time || 'N/A'}</TableCell>}
      <TableCell>
        <Badge variant="outline" className="font-normal whitespace-nowrap">
          {serviceTypeDisplay()}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[150px] truncate" title={transfer.origin}>
        {transfer.origin || 'N/A'}
      </TableCell>
      <TableCell className="max-w-[150px] truncate" title={transfer.destination}>
        {transfer.destination || 'N/A'}
      </TableCell>
      <TableCell className="text-right font-medium whitespace-nowrap">
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
        <TableCell className="max-w-[150px] truncate" title={transfer.client?.name}>
          {transfer.client?.name || 'N/A'}
        </TableCell>
      )}
      {!isMobile && <TableCell className="max-w-[150px] truncate">{transfer.collaborator || 'N/A'}</TableCell>}
      {!isMobile && <TableCell className="text-right whitespace-nowrap">{formattedCommission}</TableCell>}
      <TableCell className="text-center">
        <Badge 
          variant={transfer.paymentStatus === 'paid' ? 'success' : 'outline'}
          className="text-xs whitespace-nowrap"
        >
          {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
        </Badge>
      </TableCell>
      <TableCell className="py-0">
        {isMobile ? (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewSummary(transfer.id)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Ver resumen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddExpense(transfer.id)}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Añadir gasto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(transfer)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(transfer.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewSummary(transfer.id)}
              className="h-7 w-7"
              title="Ver resumen"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="sr-only">Ver resumen</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddExpense(transfer.id)}
              className="h-7 w-7"
              title="Añadir gasto"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span className="sr-only">Añadir gasto</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transfer)}
              className="h-7 w-7"
              title="Editar"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transfer.id)}
              className="h-7 w-7 text-destructive hover:text-destructive"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
