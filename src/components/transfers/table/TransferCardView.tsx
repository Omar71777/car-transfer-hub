import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/format';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TransferRowActions } from './TransferRowActions';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface TransferCardViewProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onSelectRow?: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string, newStatus?: 'paid' | 'pending') => void;
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
      {transfers.map((transfer) => {
        const handleTogglePaymentStatus = () => {
          if (onMarkAsPaid) {
            const newStatus = transfer.paymentStatus === 'paid' ? 'pending' : 'paid';
            onMarkAsPaid(transfer.id, newStatus);
          }
        };
        
        return (
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
                  
                  {onMarkAsPaid ? (
                    <div onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePaymentStatus();
                    }}>
                      <PaymentStatusBadge 
                        status={transfer.paymentStatus as 'paid' | 'pending'} 
                        onClick={handleTogglePaymentStatus}
                      />
                    </div>
                  ) : (
                    <Badge 
                      variant={transfer.paymentStatus === 'paid' ? "success" : "secondary"}
                      className="text-xs px-1.5 py-0"
                    >
                      {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                    </Badge>
                  )}
                  
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
                  onMarkAsPaid={onMarkAsPaid && transfer.paymentStatus === 'pending' ? () => onMarkAsPaid(transfer.id) : undefined}
                  onMarkAsUnpaid={onMarkAsPaid && transfer.paymentStatus === 'paid' ? () => onMarkAsPaid(transfer.id, 'pending') : undefined}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className="flex items-center col-span-2 text-slate-700 font-medium">
                  <div>{formatTransferDate(transfer.date)}</div>
                  {transfer.time && (
                    <div className="ml-2">{transfer.time}</div>
                  )}
                  {transfer.serviceType === 'dispo' && transfer.hours && (
                    <div className="ml-2 text-primary-600">{transfer.hours}h</div>
                  )}
                </div>
                
                <div className="col-span-2 mt-1">
                  <div className="grid grid-cols-2 gap-x-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Origen:</p>
                      <p className="text-xs text-slate-800 font-medium truncate">{transfer.origin}</p>
                    </div>
                    {transfer.serviceType === 'transfer' && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Destino:</p>
                        <p className="text-xs text-slate-800 font-medium truncate">{transfer.destination}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-1">
                  <p className="text-xs font-medium text-muted-foreground">Precio:</p>
                  <p className="text-sm font-semibold text-emerald-700">{formatCurrency(transfer.price)}</p>
                </div>
                
                <div className="mt-1">
                  {transfer.discountValue && transfer.discountValue > 0 ? (
                    <>
                      <p className="text-xs font-medium text-muted-foreground">Descuento:</p>
                      <p className="text-xs text-emerald-600 font-medium">
                        {transfer.discountType === 'percentage' 
                          ? `${transfer.discountValue}%` 
                          : formatCurrency(Number(transfer.discountValue))}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-muted-foreground">Estado:</p>
                      <p className={`text-xs font-medium ${transfer.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {transfer.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </p>
                    </>
                  )}
                </div>
                
                {transfer.collaborator && transfer.collaborator !== 'none' && (
                  <div className="col-span-2 mt-1">
                    <p className="text-xs font-medium text-muted-foreground inline mr-1">Colaborador:</p>
                    <p className="text-xs font-medium text-indigo-600 inline">
                      {transfer.collaborator}
                      {transfer.collaborator !== 'servicio propio' && 
                       transfer.commission && (
                        <span className="ml-2 text-slate-600">
                          ({transfer.commissionType === 'percentage' 
                            ? `${transfer.commission}%` 
                            : formatCurrency(Number(transfer.commission))})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
