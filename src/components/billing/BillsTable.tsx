
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Printer, Trash, Plus, Pencil } from 'lucide-react';
import { Bill } from '@/types/billing';
import { Badge } from '@/components/ui/badge';

interface BillsTableProps {
  bills: Bill[];
  onAdd: () => void;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

export function BillsTable({ bills, onAdd, onView, onEdit, onPrint, onDelete }: BillsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getBillStatusBadge = (status: Bill['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      case 'sent':
        return <Badge variant="secondary">Enviada</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-600">Pagada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return null;
    }
  };

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-4">No hay facturas registradas.</p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Factura
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Factura
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.number}</TableCell>
                <TableCell>{bill.client?.name || '-'}</TableCell>
                <TableCell>{bill.date}</TableCell>
                <TableCell>{bill.due_date}</TableCell>
                <TableCell>{formatCurrency(bill.total)}</TableCell>
                <TableCell>{getBillStatusBadge(bill.status)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="outline" onClick={() => onView(bill)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(bill)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onPrint(bill)}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDelete(bill)}
                    disabled={bill.status !== 'draft'}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
