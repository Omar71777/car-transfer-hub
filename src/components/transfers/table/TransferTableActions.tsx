
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { Transfer } from '@/types';
import { capitalizeFirstLetter } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TransferTableActionsProps {
  transfer: Transfer;
  isMobile: boolean;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
}

export function TransferTableActions({
  transfer,
  isMobile,
  onEdit,
  onDelete,
  onAddExpense
}: TransferTableActionsProps) {
  if (isMobile) {
    return (
      <DropdownMenu>
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
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex justify-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onEdit(transfer)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(transfer.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onAddExpense(transfer.id)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
