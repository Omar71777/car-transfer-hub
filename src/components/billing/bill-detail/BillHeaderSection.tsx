
import React from 'react';
import { Bill } from '@/types/billing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Download, Pencil, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { BillStatusBadge } from './BillStatusBadge';
import { format } from 'date-fns';

interface BillHeaderSectionProps {
  bill: Bill;
  onEdit: () => void;
  onPrint: (bill: Bill) => void;
  onDownload: () => void;
  onStatusChange: (status: Bill['status']) => void;
}

export function BillHeaderSection({ 
  bill, 
  onEdit, 
  onPrint, 
  onDownload, 
  onStatusChange 
}: BillHeaderSectionProps) {
  // Determinar los estados anteriores válidos para esta factura
  const getPreviousStates = () => {
    switch (bill.status) {
      case 'paid':
        return ['sent', 'draft'];
      case 'sent':
        return ['draft'];
      case 'cancelled':
        return ['draft', 'sent'];
      default:
        return [];
    }
  };

  // Determinar los estados siguientes válidos para esta factura
  const getNextStates = () => {
    switch (bill.status) {
      case 'draft':
        return ['sent', 'cancelled'];
      case 'sent':
        return ['paid', 'cancelled'];
      default:
        return [];
    }
  };

  const previousStates = getPreviousStates();
  const nextStates = getNextStates();

  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold">Factura {bill.number}</h2>
        <div className="flex items-center mt-1 space-x-2">
          <BillStatusBadge status={bill.status} />
          <span className="text-sm text-muted-foreground">
            Creada el {format(new Date(bill.created_at), 'dd/MM/yyyy')}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={() => onPrint(bill)}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button size="sm" variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        
        {nextStates.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                Cambiar estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {nextStates.map(state => (
                <DropdownMenuItem key={state} onClick={() => onStatusChange(state as Bill['status'])}>
                  {state === 'sent' ? 'Marcar como enviada' : 
                   state === 'paid' ? 'Marcar como pagada' :
                   state === 'cancelled' ? 'Cancelar factura' : 
                   `Cambiar a ${state}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {previousStates.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Revertir estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {previousStates.map(state => (
                <DropdownMenuItem key={state} onClick={() => onStatusChange(state as Bill['status'])}>
                  {state === 'draft' ? 'Revertir a borrador' : 
                   state === 'sent' ? 'Revertir a enviada' : 
                   `Revertir a ${state}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
