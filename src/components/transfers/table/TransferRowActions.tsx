
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Receipt, FileText, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TransferRowActionsProps {
  transferId: string;
  isMobile: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddExpense: () => void;
  onViewSummary: () => void;
}

export function TransferRowActions({
  transferId,
  isMobile,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary
}: TransferRowActionsProps) {
  return (
    <div className={`flex ${isMobile ? 'justify-end' : 'justify-center'}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 focus-visible:ring-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onViewSummary}>
            <FileText className="h-4 w-4 mr-2" />
            Ver resumen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddExpense}>
            <Receipt className="h-4 w-4 mr-2" />
            Añadir gasto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
