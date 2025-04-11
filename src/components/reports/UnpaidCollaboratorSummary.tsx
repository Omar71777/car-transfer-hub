
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';

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
  const isMobile = useIsMobile();
  
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

  if (isMobile) {
    // Card-based layout for mobile
    return (
      <div className="space-y-3 mobile-card-table">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay pagos pendientes para mostrar
          </div>
        ) : (
          <>
            {filteredData.map((data, index) => (
              <Card key={`${data.collaborator}-${data.month}-${index}`} className="table-row">
                <CardContent className="p-3">
                  <div className="table-cell">
                    <span className="table-cell-label">Colaborador:</span>
                    <span className="table-cell-value font-medium">{data.collaborator}</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-cell-label">Mes:</span>
                    <span className="table-cell-value">{data.month}</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-cell-label">Nº Transfers:</span>
                    <span className="table-cell-value">{data.transferCount}</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-cell-label">Total a Pagar:</span>
                    <span className="table-cell-value font-medium">{formatCurrency(data.total)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total general:</span>
                  <span className="font-semibold">{formatCurrency(grandTotal)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="table-container table-centered">
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead className="col-collaborator">Colaborador</TableHead>
            <TableHead className="col-date">Mes</TableHead>
            <TableHead className="text-right col-type">Nº Transfers</TableHead>
            <TableHead className="text-right col-total">Total a Pagar</TableHead>
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
