
import React from 'react';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Bill } from '@/types/billing';
import { BillTableHeader } from './BillTableHeader';
import { BillTableRow } from './BillTableRow';
import { EmptyBillsState } from './EmptyBillsState';

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

  if (bills.length === 0) {
    return <EmptyBillsState onAdd={onAdd} />;
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
          <BillTableHeader />
          <TableBody>
            {bills.map((bill) => (
              <BillTableRow
                key={bill.id}
                bill={bill}
                formatCurrency={formatCurrency}
                onView={onView}
                onEdit={onEdit}
                onPrint={onPrint}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
