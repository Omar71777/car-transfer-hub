
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
  if (isMobile) {
    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
  
  return (
    <div className="flex items-center justify-end space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onViewSummary}
        className="h-7 w-7"
        title="Ver resumen"
      >
        <FileText className="h-3.5 w-3.5" />
        <span className="sr-only">Ver resumen</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAddExpense}
        className="h-7 w-7"
        title="Añadir gasto"
      >
        <Receipt className="h-3.5 w-3.5" />
        <span className="sr-only">Añadir gasto</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-7 w-7"
        title="Editar"
      >
        <Edit2 className="h-3.5 w-3.5" />
        <span className="sr-only">Editar</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-7 w-7 text-destructive hover:text-destructive"
        title="Eliminar"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Eliminar</span>
      </Button>
    </div>
  );
}
