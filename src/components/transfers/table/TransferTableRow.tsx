
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransferRowActions } from './TransferRowActions';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

interface TransferTableRowProps {
  transfer: any;
  onEdit: (transfer: any) => void;
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
  
  // Calculate profit (price - commission)
  const calculateProfit = () => {
    const price = Number(transfer.price);
    
    if (!transfer.commission || !transfer.commissionType) {
      return price;
    }
    
    const commission = Number(transfer.commission);
    
    if (transfer.commissionType === 'percentage') {
      return price - (price * commission / 100);
    } else {
      return price - commission;
    }
  };
  
  // Format date
  const formattedDate = transfer.date 
    ? format(new Date(transfer.date), 'dd-MM-yyyy', { locale: es })
    : 'N/A';
  
  // Get service type display text
  const getServiceType = () => {
    if (transfer.serviceType === 'dispo') {
      return 'Disposición';
    } 
    return 'Transfer';
  };
  
  // Get payment status class
  const getPaymentStatusClass = () => {
    return transfer.paymentStatus === 'paid' 
      ? 'text-green-600 font-medium' 
      : 'text-amber-600 font-medium';
  };
  
  // Get payment status text
  const getPaymentStatusText = () => {
    return transfer.paymentStatus === 'paid' 
      ? 'Cobrado' 
      : 'Pendiente';
  };
  
  // Format profit with appropriate currency
  const profit = calculateProfit();
  const formattedProfit = formatCurrency(profit);
  
  return (
    <TableRow 
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/80",
        selected && "bg-muted/50"
      )}
      data-state={selected ? "selected" : ""}
      onClick={() => onViewSummary(transfer.id)}
    >
      <TableCell className="w-[36px] p-0 text-center">
        {onSelectRow && (
          <div onClick={(e) => {
            e.stopPropagation();
            onSelectRow(transfer.id, !selected);
          }} className="flex justify-center">
            <Checkbox 
              checked={selected} 
              onCheckedChange={(checked) => onSelectRow(transfer.id, !!checked)}
              aria-label="Select row" 
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
            />
          </div>
        )}
      </TableCell>
      
      <TableCell className="col-date text-center font-medium">{formattedDate}</TableCell>
      
      <TableCell className="col-type text-center">
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          transfer.serviceType === 'dispo' 
            ? "bg-blue-100 text-blue-800" 
            : "bg-purple-100 text-purple-800"
        )}>
          {getServiceType()}
        </span>
      </TableCell>
      
      {!isMobile && (
        <TableCell className="col-client">
          <span className="truncate-cell">{transfer.client?.name || "Cliente no asignado"}</span>
        </TableCell>
      )}
      
      {!isMobile && (
        <TableCell className="col-collaborator">
          <span className="truncate-cell">
            {transfer.collaborator || "Servicio propio"}
          </span>
        </TableCell>
      )}
      
      {!isMobile && (
        <TableCell className="col-total text-right font-medium">
          {formattedProfit}
        </TableCell>
      )}
      
      <TableCell className="col-status text-center">
        <span className={getPaymentStatusClass()}>
          {getPaymentStatusText()}
        </span>
      </TableCell>
      
      <TableCell className="col-actions p-0">
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
