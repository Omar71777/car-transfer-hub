
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Bill } from '@/types/billing';
import { BillStatusBadge } from './BillStatusBadge';
import { BillTableActions } from './BillTableActions';

interface BillTableRowProps {
  bill: Bill;
  formatCurrency: (amount: number) => string;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

export function BillTableRow({ 
  bill, 
  formatCurrency, 
  onView, 
  onEdit, 
  onPrint, 
  onDelete 
}: BillTableRowProps) {
  return (
    <TableRow key={bill.id}>
      <TableCell className="font-medium">{bill.number}</TableCell>
      <TableCell>{bill.client?.name || '-'}</TableCell>
      <TableCell>{bill.date}</TableCell>
      <TableCell>{bill.due_date}</TableCell>
      <TableCell>{formatCurrency(bill.total)}</TableCell>
      <TableCell>
        <BillStatusBadge status={bill.status} />
      </TableCell>
      <TableCell>
        <BillTableActions 
          bill={bill}
          onView={onView}
          onEdit={onEdit}
          onPrint={onPrint}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
