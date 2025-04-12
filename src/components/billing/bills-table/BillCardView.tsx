
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bill } from '@/types/billing';
import { BillStatusBadge } from './BillStatusBadge';
import { BillTableActions } from './BillTableActions';
import { CalendarDays, User, CreditCard } from 'lucide-react';

interface BillCardViewProps {
  bills: Bill[];
  formatCurrency: (amount: number) => string;
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}

export function BillCardView({
  bills,
  formatCurrency,
  onView,
  onEdit,
  onPrint,
  onDelete
}: BillCardViewProps) {
  if (bills.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay facturas para mostrar</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card 
          key={bill.id} 
          className="overflow-hidden transition-all hover:border-primary/40"
          onClick={() => onView(bill)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="font-medium">Factura #{bill.number}</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(bill.total)}
                </span>
              </div>
              <BillStatusBadge status={bill.status} />
            </div>
            
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{bill.client?.name || '-'}</span>
              </div>
              
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>Fecha: {bill.date}</span>
                  <span className="text-xs text-muted-foreground">
                    Vencimiento: {bill.due_date}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatCurrency(bill.total)}</span>
              </div>
            </div>
            
            <div className="pt-3 mt-3 border-t border-border/40">
              <BillTableActions
                bill={bill}
                onView={onView}
                onEdit={onEdit}
                onPrint={onPrint}
                onDelete={onDelete}
                isMobile={true}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
