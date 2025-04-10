
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Transfer } from '@/types';
import { formatCurrency, capitalizeFirstLetter } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TransfersTableProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
}

export function TransfersTable({
  transfers,
  onEdit,
  onDelete,
  onAddExpense
}: TransfersTableProps) {
  const isMobile = useIsMobile();
  
  // Function to display commission value with appropriate format
  const formatCommission = (transfer: Transfer) => {
    if (transfer.commissionType === 'percentage') {
      return `${transfer.commission}% (${formatCurrency((transfer.price * transfer.commission) / 100)})`;
    } else {
      return `${formatCurrency(transfer.commission)} (${((transfer.commission / transfer.price) * 100).toFixed(1)}%)`;
    }
  };
  
  return <div className="rounded-md border overflow-hidden glass-card px-[7px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{capitalizeFirstLetter('fecha')}</TableHead>
            {!isMobile && <TableHead>{capitalizeFirstLetter('hora')}</TableHead>}
            <TableHead>{capitalizeFirstLetter('origen')}</TableHead>
            <TableHead>{capitalizeFirstLetter('destino')}</TableHead>
            <TableHead className="text-right">{capitalizeFirstLetter('precio')}</TableHead>
            {!isMobile && <TableHead>{capitalizeFirstLetter('colaborador')}</TableHead>}
            {!isMobile && <TableHead className="text-right">{capitalizeFirstLetter('comisión')}</TableHead>}
            <TableHead className="text-center">{capitalizeFirstLetter('estado')}</TableHead>
            <TableHead className="text-center">{capitalizeFirstLetter('acciones')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? <TableRow>
              <TableCell colSpan={isMobile ? 6 : 9} className="text-center py-8 text-muted-foreground">
                {capitalizeFirstLetter('no hay transfers registrados')}
              </TableCell>
            </TableRow> : transfers.map(transfer => <TableRow key={transfer.id}>
                <TableCell>{transfer.date}</TableCell>
                {!isMobile && <TableCell>{transfer.time}</TableCell>}
                <TableCell className="max-w-[100px] truncate" title={capitalizeFirstLetter(transfer.origin)}>
                  {capitalizeFirstLetter(transfer.origin)}
                </TableCell>
                <TableCell className="max-w-[100px] truncate" title={capitalizeFirstLetter(transfer.destination)}>
                  {capitalizeFirstLetter(transfer.destination)}
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(transfer.price)}</TableCell>
                {!isMobile && <TableCell>{capitalizeFirstLetter(transfer.collaborator)}</TableCell>}
                {!isMobile && <TableCell className="text-right">
                  {formatCommission(transfer)}
                </TableCell>}
                <TableCell className="text-center">
                  {transfer.paymentStatus === 'paid' ? <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('cobrado')}</span>}
                    </div> : <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                      <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {!isMobile && <span className="text-xs font-medium">{capitalizeFirstLetter('pendiente')}</span>}
                    </div>}
                </TableCell>
                <TableCell>
                  {isMobile ? <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transfer)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {capitalizeFirstLetter('editar')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(transfer.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {capitalizeFirstLetter('eliminar')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddExpense(transfer.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          {capitalizeFirstLetter('añadir gasto')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> : <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(transfer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(transfer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onAddExpense(transfer.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>}
                </TableCell>
              </TableRow>)}
        </TableBody>
      </Table>
    </div>;
}
