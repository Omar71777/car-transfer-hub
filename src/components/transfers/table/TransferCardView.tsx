
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transfer } from '@/types';
import { MoreVertical, MapPin, Calendar, Clock, User } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransferCardViewProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onSelectRow?: (id: string, selected: boolean) => void;
  selectedRows?: string[];
}

export function TransferCardView({
  transfers,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onSelectRow,
  selectedRows = []
}: TransferCardViewProps) {
  if (transfers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay transfers para mostrar</p>
      </div>
    );
  }

  // Format date
  const formatTransferDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <Card 
          key={transfer.id} 
          className="overflow-hidden transition-all hover:border-primary/40"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {onSelectRow && (
                  <Checkbox
                    checked={selectedRows.includes(transfer.id)}
                    onCheckedChange={(checked) => {
                      onSelectRow(transfer.id, !!checked);
                    }}
                    className="mr-2"
                  />
                )}
                <Badge 
                  variant={transfer.serviceType === 'transfer' ? "default" : "secondary"}
                  className="text-xs font-medium uppercase"
                >
                  {transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}
                </Badge>
                <Badge 
                  variant={transfer.paymentStatus === 'paid' ? "outline" : "secondary"}
                  className={`text-xs ${transfer.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                >
                  {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                </Badge>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(transfer)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewSummary(transfer.id)}>
                      Ver resumen
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddExpense(transfer.id)}>
                      Añadir gasto
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => onDelete(transfer.id)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatTransferDate(transfer.date)}</span>
                {transfer.time && (
                  <>
                    <Clock className="h-4 w-4 mx-2 text-muted-foreground" />
                    <span>{transfer.time}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Origen:</p>
                  <p className="text-muted-foreground truncate">{transfer.origin}</p>
                  {transfer.serviceType === 'transfer' && (
                    <>
                      <p className="font-medium mt-1">Destino:</p>
                      <p className="text-muted-foreground truncate">{transfer.destination}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center">
                  <span className="font-medium">{formatCurrency(transfer.price)}</span>
                  {transfer.serviceType === 'dispo' && transfer.hours && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({transfer.hours} horas)
                    </span>
                  )}
                </div>
                
                {transfer.collaborator && transfer.collaborator !== 'none' && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {transfer.collaborator}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
