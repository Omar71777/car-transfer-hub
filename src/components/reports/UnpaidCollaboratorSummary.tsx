
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Transfer } from '@/types';

interface MonthlyData {
  collaborator: string;
  month: string;
  transferCount: number;
  total: number;
  transfers: Transfer[];
}

interface UnpaidCollaboratorSummaryProps {
  monthlyData: MonthlyData[];
  loading?: boolean;
  selectedCollaborator: string;
}

export function UnpaidCollaboratorSummary({ 
  monthlyData, 
  loading = false,
  selectedCollaborator
}: UnpaidCollaboratorSummaryProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-10 w-10 text-primary animate-spin mr-2" />
        <p className="text-lg">Cargando resumen de pagos pendientes...</p>
      </div>
    );
  }

  // Filter data if a specific collaborator is selected
  const filteredData = selectedCollaborator === 'all' 
    ? monthlyData 
    : monthlyData.filter(data => data.collaborator === selectedCollaborator);

  // Calculate total for all filtered data
  const grandTotal = filteredData.reduce((sum, data) => sum + data.total, 0);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead>Mes</TableHead>
            <TableHead className="text-right">Nº Transfers</TableHead>
            <TableHead className="text-right">Total a Pagar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No hay pagos pendientes para mostrar
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((data, index) => (
              <TableRow key={`${data.collaborator}-${data.month}-${index}`}>
                <TableCell className="font-medium">{data.collaborator}</TableCell>
                <TableCell>{data.month}</TableCell>
                <TableCell className="text-right">{data.transferCount}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(data.total)}</TableCell>
              </TableRow>
            ))
          )}
          {filteredData.length > 0 && (
            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="text-right font-semibold">Total general:</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(grandTotal)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
