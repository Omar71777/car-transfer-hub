
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface UnpaidTransfersTableProps {
  transfers: Transfer[];
  loading?: boolean;
}

export function UnpaidTransfersTable({
  transfers,
  loading = false
}: UnpaidTransfersTableProps) {
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-10 w-10 text-primary animate-spin mr-2" />
        <p className="text-lg">Cargando transfers pendientes...</p>
      </div>
    );
  }
  
  if (isMobile) {
    // Card-based layout for mobile
    return (
      <div className="space-y-3 mobile-card-table">
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay transfers pendientes de pago
          </div>
        ) : (
          <>
            {transfers.map(transfer => {
              const commissionAmount = transfer.commissionType === 'percentage' 
                ? (transfer.price * transfer.commission / 100)
                : transfer.commission;
              const amountToPay = transfer.price - commissionAmount;
              
              return (
                <Card key={transfer.id} className="table-row">
                  <CardContent className="p-3">
                    <div className="table-cell">
                      <span className="table-cell-label">Fecha:</span>
                      <span className="table-cell-value">{transfer.date}</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-cell-label">Colaborador:</span>
                      <span className="table-cell-value">{transfer.collaborator || 'N/A'}</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-cell-label">Origen:</span>
                      <span className="table-cell-value">{transfer.origin}</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-cell-label">Destino:</span>
                      <span className="table-cell-value">{transfer.destination}</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-cell-label">Importe:</span>
                      <span className="table-cell-value font-medium">{formatCurrency(amountToPay)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total a pagar:</span>
                  <span className="font-semibold">
                    {formatCurrency(transfers.reduce((sum, transfer) => {
                      const commissionAmount = transfer.commissionType === 'percentage' 
                        ? (transfer.price * transfer.commission / 100)
                        : transfer.commission;
                      return sum + (transfer.price - commissionAmount);
                    }, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }
  
  // Desktop table view
  return (
    <div className="table-container table-centered">
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead className="col-date">Fecha</TableHead>
            <TableHead className="col-collaborator">Colaborador</TableHead>
            <TableHead className="col-location">Origen</TableHead>
            <TableHead className="col-location">Destino</TableHead>
            <TableHead className="col-total text-right">Precio</TableHead>
            <TableHead className="col-type text-right">Comisión</TableHead>
            <TableHead className="col-total text-right">Importe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay transfers pendientes de pago
              </TableCell>
            </TableRow>
          ) : (
            transfers.map(transfer => {
              const commissionAmount = transfer.commissionType === 'percentage' 
                ? (transfer.price * transfer.commission / 100)
                : transfer.commission;
              const amountToPay = transfer.price - commissionAmount;
              
              return (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>{transfer.collaborator || 'N/A'}</TableCell>
                  <TableCell className="truncate-cell" title={transfer.origin}>
                    {transfer.origin}
                  </TableCell>
                  <TableCell className="truncate-cell" title={transfer.destination}>
                    {transfer.destination}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(transfer.price)}</TableCell>
                  <TableCell className="text-right">
                    {transfer.commissionType === 'percentage' 
                      ? `${transfer.commission}%` 
                      : formatCurrency(transfer.commission)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(amountToPay)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
          {transfers.length > 0 && (
            <TableRow className="bg-muted/50">
              <TableCell colSpan={6} className="text-right font-semibold">Total a pagar:</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(transfers.reduce((sum, transfer) => {
                  const commissionAmount = transfer.commissionType === 'percentage' 
                    ? (transfer.price * transfer.commission / 100)
                    : transfer.commission;
                  return sum + (transfer.price - commissionAmount);
                }, 0))}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
