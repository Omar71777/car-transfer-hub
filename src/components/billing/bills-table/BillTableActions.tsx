
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Printer, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Bill } from '@/types/billing';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface BillTableActionsProps {
  bill: Bill;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
  isMobile?: boolean;
}

export function BillTableActions({ 
  bill, 
  onView, 
  onEdit, 
  onPrint, 
  onDelete,
  isMobile = false
}: BillTableActionsProps) {
  if (isMobile) {
    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 relative z-10">
              <span className="sr-only">Abrir menú</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50 bg-popover border border-border shadow-md">
            <DropdownMenuItem onClick={() => onView(bill)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(bill)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPrint(bill)}>
              <Printer className="mr-2 h-4 w-4" />
              <span>Imprimir</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(bill)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(bill)}>
        <span className="sr-only">Ver factura</span>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onEdit(bill)}>
        <span className="sr-only">Editar factura</span>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onPrint(bill)}>
        <span className="sr-only">Imprimir factura</span>
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(bill)}>
        <span className="sr-only">Eliminar factura</span>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
