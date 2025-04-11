
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter } from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransfersReportTableProps {
  transfers: Transfer[];
  loading: boolean;
}

export function TransfersReportTable({
  transfers,
  loading
}: TransfersReportTableProps) {
  const isMobile = useIsMobile();

  // Calculate totals
  const totalPrice = transfers.reduce((sum, t) => sum + t.price, 0);
  const totalCommissions = transfers.reduce((sum, t) => {
    // Consider commission type when calculating
    return sum + (t.commissionType === 'percentage' 
      ? (t.price * t.commission / 100) 
      : t.commission);
  }, 0);

  return (
    <Table className="min-w-max">
      <TableCaption>Lista de todos los transfers registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          {!isMobile && <TableHead>Hora</TableHead>}
          <TableHead className="truncate-cell">Origen</TableHead>
          <TableHead className="truncate-cell">Destino</TableHead>
          <TableHead className="text-right">Precio (€)</TableHead>
          {!isMobile && <TableHead>Colaborador</TableHead>}
          {!isMobile && <TableHead>Comisión</TableHead>}
          <TableHead className="text-right">Comisión (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={isMobile ? 5 : 8} className="text-center py-8">Cargando...</TableCell>
          </TableRow>
        ) : transfers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isMobile ? 5 : 8} className="text-center py-8">No hay transfers registrados</TableCell>
          </TableRow>
        ) : transfers.map(transfer => {
            // Calculate commission amount based on commission type
            const commissionAmount = transfer.commissionType === 'percentage'
              ? transfer.price * transfer.commission / 100
              : transfer.commission;
            
            return (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.date}</TableCell>
                {!isMobile && <TableCell>{transfer.time || 'N/A'}</TableCell>}
                <TableCell className="truncate-cell" title={transfer.origin}>
                  {transfer.origin}
                </TableCell>
                <TableCell className="truncate-cell" title={transfer.destination}>
                  {transfer.destination}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transfer.price)}</TableCell>
                {!isMobile && <TableCell>{transfer.collaborator || 'N/A'}</TableCell>}
                {!isMobile && (
                  <TableCell>
                    {transfer.commissionType === 'percentage' 
                      ? `${transfer.commission}%` 
                      : formatCurrency(transfer.commission)}
                  </TableCell>
                )}
                <TableCell className="text-right">{formatCurrency(commissionAmount)}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
      {transfers.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={isMobile ? 3 : 6} className="text-right font-bold">Totales:</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(totalPrice)}</TableCell>
            {!isMobile && <TableCell></TableCell>}
            <TableCell className="text-right font-bold">{formatCurrency(totalCommissions)}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
