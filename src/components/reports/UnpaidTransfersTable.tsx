
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            {!isMobile && <TableHead>Colaborador</TableHead>}
            <TableHead className="max-w-[100px]">Origen</TableHead>
            <TableHead className="max-w-[100px]">Destino</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            {!isMobile && <TableHead className="text-right">Comisión</TableHead>}
            <TableHead className="text-right">Importe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 5 : 7} className="text-center py-8 text-muted-foreground">
                No hay transfers pendientes de pago
              </TableCell>
            </TableRow>
          ) : (
            transfers.map(transfer => {
              const commissionAmount = transfer.price * transfer.commission / 100;
              const amountToPay = transfer.price - commissionAmount;
              return (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.date}</TableCell>
                  {!isMobile && <TableCell>{transfer.collaborator || 'N/A'}</TableCell>}
                  <TableCell className="max-w-[100px] truncate" title={transfer.origin}>
                    {transfer.origin}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate" title={transfer.destination}>
                    {transfer.destination}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(transfer.price)}</TableCell>
                  {!isMobile && <TableCell className="text-right">{transfer.commission}%</TableCell>}
                  <TableCell className="text-right font-medium">
                    {formatCurrency(amountToPay)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
          {transfers.length > 0 && (
            <TableRow className="bg-muted/50">
              <TableCell colSpan={isMobile ? 4 : 6} className="text-right font-semibold">Total a cobrar:</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(transfers.reduce((sum, transfer) => {
                  const commissionAmount = transfer.price * transfer.commission / 100;
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
