
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface UnpaidTransfersTableProps {
  transfers: Transfer[];
  loading?: boolean;
}

export function UnpaidTransfersTable({ transfers, loading = false }: UnpaidTransfersTableProps) {
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
            <TableHead>Colaborador</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Comisión</TableHead>
            <TableHead className="text-right">Importe</TableHead>
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
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.date}</TableCell>
                <TableCell>{transfer.collaborator || 'N/A'}</TableCell>
                <TableCell>{transfer.origin}</TableCell>
                <TableCell>{transfer.destination}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(transfer.price)}</TableCell>
                <TableCell className="text-right">{transfer.commission}%</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency((transfer.price * transfer.commission) / 100)}
                </TableCell>
              </TableRow>
            ))
          )}
          {transfers.length > 0 && (
            <TableRow className="bg-muted/50">
              <TableCell colSpan={6} className="text-right font-semibold">Total a pagar:</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(
                  transfers.reduce(
                    (sum, transfer) => sum + (transfer.price * transfer.commission) / 100, 
                    0
                  )
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
