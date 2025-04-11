
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
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BillsTableProps {
  bills: Bill[];
  loading?: boolean;
  onAdd: () => void;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

export function BillsTable({ 
  bills, 
  loading = false, 
  onAdd, 
  onView, 
  onEdit, 
  onPrint, 
  onDelete 
}: BillsTableProps) {
  const isMobile = useIsMobile();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (bills.length === 0 && !loading) {
    return <EmptyBillsState onAdd={onAdd} />;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd} className={isMobile ? "mobile-btn" : ""}>
          <Plus className="mr-2 h-4 w-4" />
          {isMobile ? "Nueva" : "Crear Factura"}
        </Button>
      </div>

      <div className="table-container">
        {isMobile ? (
          <div className="overflow-x-auto px-1 w-full">
            <Table className="mobile-table">
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
        ) : (
          <ScrollArea className="w-full">
            <div className="min-w-full table-scroll-container">
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
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
