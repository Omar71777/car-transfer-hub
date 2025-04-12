
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bill } from '@/types/billing';
import { BillStatusBadge } from './BillStatusBadge';
import { BillTableActions } from './BillTableActions';

interface BillCardViewProps {
  bills: Bill[];
  formatCurrency: (amount: number) => string;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
  onMarkAsSent?: (bill: Bill) => void;
  onMarkAsPaid?: (bill: Bill) => void;
}

export function BillCardView({
  bills,
  formatCurrency,
  onView,
  onEdit,
  onPrint,
  onDelete,
  onMarkAsSent,
  onMarkAsPaid
}: BillCardViewProps) {
  if (bills.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay facturas para mostrar</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <Card 
          key={bill.id} 
          className="overflow-hidden transition-all hover:border-primary/40 touch-list-item"
          onClick={() => onView(bill)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="font-medium text-primary text-sm">Factura #{bill.number}</span>
                <span className="text-lg font-semibold text-emerald-700">
                  {formatCurrency(bill.total)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BillStatusBadge status={bill.status} />
                <BillTableActions
                  bill={bill}
                  onView={onView}
                  onEdit={onEdit}
                  onPrint={onPrint}
                  onDelete={onDelete}
                  onMarkAsSent={onMarkAsSent}
                  onMarkAsPaid={onMarkAsPaid}
                  isMobile={true}
                />
              </div>
            </div>
            
            <div className="text-slate-800">
              <span className="text-sm font-medium">{bill.client?.name || '-'}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
