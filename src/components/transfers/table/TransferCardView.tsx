import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transfer } from '@/types';
import { 
  MapPin, Calendar, Clock, User, DollarSign, 
  Tag, CreditCard, Percent, CheckCircle, Timer
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TransferRowActions } from './TransferRowActions';

interface TransferCardViewProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onSelectRow?: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string) => void;
  onMarkAsBilled?: (transferId: string) => void;
  selectedRows?: string[];
}

export function TransferCardView({
  transfers,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onSelectRow,
  onMarkAsPaid,
  onMarkAsBilled,
  selectedRows = []
}: TransferCardViewProps) {
  if (transfers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay transfers para mostrar</p>
      </div>
    );
  }

  const formatTransferDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <Card 
          key={transfer.id} 
          className="overflow-hidden transition-all hover:border-primary/40"
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {onSelectRow && (
                  <Checkbox
                    checked={selectedRows.includes(transfer.id)}
                    onCheckedChange={(checked) => {
                      onSelectRow(transfer.id, !!checked);
                    }}
                    className="mr-1"
                  />
                )}
                <Badge 
                  variant={transfer.serviceType === 'transfer' ? "default" : "secondary"}
                  className="text-xs font-medium uppercase px-1.5 py-0"
                >
                  {transfer.serviceType === 'transfer' ? 'Transfer' : 'Dispo'}
                </Badge>
                <Badge 
                  variant={transfer.paymentStatus === 'paid' ? "outline" : "secondary"}
                  className={`text-xs px-1.5 py-0 ${transfer.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                >
                  {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                </Badge>
                {transfer.billed && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 bg-blue-100 text-blue-800">
                    Facturado
                  </Badge>
                )}
              </div>
              <TransferRowActions
                transferId={transfer.id}
                isMobile={true}
                onEdit={() => onEdit(transfer)}
                onDelete={() => onDelete(transfer.id)}
                onAddExpense={() => onAddExpense(transfer.id)}
                onViewSummary={() => onViewSummary(transfer.id)}
                onMarkAsPaid={() => onMarkAsPaid && onMarkAsPaid(transfer.id)}
                onMarkAsBilled={() => onMarkAsBilled && onMarkAsBilled(transfer.id)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div className="flex items-center col-span-2">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>{formatTransferDate(transfer.date)}</span>
                {transfer.time && (
                  <>
                    <Clock className="h-3.5 w-3.5 mx-1.5 text-muted-foreground" />
                    <span>{transfer.time}</span>
                  </>
                )}
                {transfer.serviceType === 'dispo' && transfer.hours && (
                  <>
                    <Timer className="h-3.5 w-3.5 mx-1.5 text-muted-foreground" />
                    <span>{transfer.hours}h</span>
                  </>
                )}
              </div>
              
              <div className="col-span-2">
                <div className="flex items-start space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-x-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Origen:</p>
                        <p className="text-xs truncate">{transfer.origin}</p>
                      </div>
                      {transfer.serviceType === 'transfer' && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Destino:</p>
                          <p className="text-xs truncate">{transfer.destination}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Precio:</p>
                  <p className="text-sm font-medium">{formatCurrency(transfer.price)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                {transfer.discountValue && transfer.discountValue > 0 ? (
                  <>
                    <Percent className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Descuento:</p>
                      <p className="text-xs text-emerald-600 font-medium">
                        {transfer.discountType === 'percentage' 
                          ? `${transfer.discountValue}%` 
                          : formatCurrency(Number(transfer.discountValue))}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Estado:</p>
                      <p className="text-xs">
                        {transfer.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {transfer.collaborator && transfer.collaborator !== 'none' && (
                <div className="col-span-1 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Colaborador:</p>
                    <p className="text-xs truncate">
                      {transfer.collaborator}
                    </p>
                  </div>
                </div>
              )}
              
              {transfer.collaborator && 
                transfer.collaborator !== 'none' && 
                transfer.collaborator !== 'servicio propio' && 
                transfer.commission && (
                <div className="col-span-1 flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Comisión:</p>
                    <p className="text-xs">
                      {transfer.commissionType === 'percentage' 
                        ? `${transfer.commission}%` 
                        : formatCurrency(Number(transfer.commission))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
