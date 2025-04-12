
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter } from '@/components/ui/table';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

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
  const totalPrice = transfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
  const totalCommissions = transfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
  const totalAfterCommission = totalPrice - totalCommissions;

  return (
    <Table className="min-w-max">
      <TableCaption>Lista de todos los transfers registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Precio (€)</TableHead>
          {!isMobile && <TableHead>Cliente</TableHead>}
          {!isMobile && <TableHead>Colaborador</TableHead>}
          <TableHead className="text-right">Comisión (€)</TableHead>
          <TableHead className="text-right">Total (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-8">Cargando...</TableCell>
          </TableRow>
        ) : transfers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-8">No hay transfers registrados</TableCell>
          </TableRow>
        ) : transfers.map(transfer => {
            // Calculate price including extras and discounts
            const totalPrice = calculateTotalPrice(transfer);
            
            // Calculate commission amount based on the correct formula
            const commissionAmount = calculateCommissionAmount(transfer);
            
            // Calculate total after commission
            const totalAfterCommission = totalPrice - commissionAmount;
            
            return (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.date}</TableCell>
                <TableCell>{transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPrice)}</TableCell>
                {!isMobile && <TableCell className="truncate-cell">{transfer.client?.name || 'N/A'}</TableCell>}
                {!isMobile && <TableCell className="truncate-cell">{transfer.collaborator || 'N/A'}</TableCell>}
                <TableCell className="text-right">{formatCurrency(commissionAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalAfterCommission)}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
      {transfers.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={isMobile ? 2 : 4} className="text-right font-bold">Totales:</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(totalPrice)}</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(totalCommissions)}</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(totalAfterCommission)}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
