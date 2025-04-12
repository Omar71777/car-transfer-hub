
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Receipt, FileText, MoreVertical, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface TransferRowActionsProps {
  transferId: string;
  isMobile: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddExpense: () => void;
  onViewSummary: () => void;
  onMarkAsPaid?: () => void;
}

export function TransferRowActions({
  transferId,
  isMobile,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onMarkAsPaid
}: TransferRowActionsProps) {
  return (
    <div className={`flex ${isMobile ? 'justify-end' : 'justify-center'}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 focus-visible:ring-0 relative"
            onClick={(e) => {
              // Ensure the event doesn't bubble up to parent elements
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Opciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-background border border-border rounded-md shadow-md"
          style={{ zIndex: 999, position: 'relative' }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            // Ensure pointer events are enabled
            document.body.style.pointerEvents = 'auto';
          }}
        >
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              onViewSummary();
              // Ensure pointer events are enabled
              document.body.style.pointerEvents = 'auto';
            }} 
            className="cursor-pointer"
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver resumen
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              onAddExpense();
            }} 
            className="cursor-pointer"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Añadir gasto
          </DropdownMenuItem>
          
          {onMarkAsPaid && (
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsPaid();
              }} 
              className="cursor-pointer"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Marcar como cobrado
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} 
            className="cursor-pointer"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
            className="text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
