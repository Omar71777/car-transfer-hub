
import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  
  // Improved event handling - prevent propagation and remove setTimeout
  const handleAction = (e: React.MouseEvent, actionFn: (bill: Bill) => void) => {
    e.preventDefault();  // Prevent default behavior
    e.stopPropagation(); // Prevent event from bubbling up
    
    setOpen(false);      // Close dropdown if open
    actionFn(bill);      // Call the action with the bill directly
  };

  if (isMobile) {
    return (
      <div className="flex justify-end" onClick={e => e.stopPropagation()}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 relative"
              onClick={e => e.stopPropagation()}
            >
              <span className="sr-only">Abrir menú</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-popover border border-border shadow-md"
            onClick={e => e.stopPropagation()}
          >
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              handleAction(e as unknown as React.MouseEvent, onView);
            }}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              handleAction(e as unknown as React.MouseEvent, onEdit);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              handleAction(e as unknown as React.MouseEvent, onPrint);
            }}>
              <Printer className="mr-2 h-4 w-4" />
              <span>Imprimir</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              handleAction(e as unknown as React.MouseEvent, onDelete);
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => handleAction(e, onView)}
        className="h-8 w-8"
      >
        <span className="sr-only">Ver factura</span>
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => handleAction(e, onEdit)}
        className="h-8 w-8"
      >
        <span className="sr-only">Editar factura</span>
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => handleAction(e, onPrint)}
        className="h-8 w-8"
      >
        <span className="sr-only">Imprimir factura</span>
        <Printer className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={(e) => handleAction(e, onDelete)}
        className="h-8 w-8"
      >
        <span className="sr-only">Eliminar factura</span>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
