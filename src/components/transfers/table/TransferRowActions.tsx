
import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  
  const handleAction = (actionFn: () => void) => {
    setOpen(false);
    actionFn();
  };

  return (
    <div className={`flex ${isMobile ? 'justify-end' : 'justify-center'}`}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isMobile ? 'h-8 w-8' : 'h-8 w-8'} focus-visible:ring-0`}
          >
            <MoreVertical className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction(onViewSummary)}>
            <FileText className="h-4 w-4 mr-2" />
            Ver resumen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(onAddExpense)}>
            <Receipt className="h-4 w-4 mr-2" />
            Añadir gasto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(onEdit)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction(onDelete)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
