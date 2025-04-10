
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Printer, Trash } from 'lucide-react';
import { Bill } from '@/types/billing';

interface BillTableActionsProps {
  bill: Bill;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

export function BillTableActions({ bill, onView, onEdit, onPrint, onDelete }: BillTableActionsProps) {
  return (
    <div className="text-right space-x-1">
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
    </div>
  );
}
