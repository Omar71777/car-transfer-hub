
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bill } from '@/types/billing';
import { BillStatusBadge } from './BillStatusBadge';
import { BillTableActions } from './BillTableActions';
import { CalendarDays, User, CreditCard, FileText, Clock, Tag, Building, Phone } from 'lucide-react';

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
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };
  
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
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="font-medium text-sm">Factura #{bill.number}</span>
                </div>
                <span className="text-xs text-muted-foreground">
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
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs mt-2">
              {/* Client information */}
              <div className="col-span-2 flex">
                <User className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium">{bill.client?.name || '-'}</div>
                  {bill.client?.email && (
                    <div className="text-xs text-muted-foreground truncate">{bill.client.email}</div>
                  )}
                </div>
              </div>
              
              {/* Company information if available */}
              {bill.client?.company && (
                <div className="col-span-2 flex">
                  <Building className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{bill.client.company}</div>
                    {bill.client?.vat && (
                      <div className="text-xs text-muted-foreground">CIF/NIF: {bill.client.vat}</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Phone if available */}
              {bill.client?.phone && (
                <div className="col-span-1 flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="text-xs">{bill.client.phone}</span>
                </div>
              )}
              
              {/* Dates information */}
              <div className="col-span-2 flex">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="grid grid-cols-2 gap-x-2 w-full">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Fecha:</div>
                    <div className="text-xs">{formatDate(bill.date)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Vencimiento:</div>
                    <div className="text-xs">{formatDate(bill.due_date)}</div>
                  </div>
                </div>
              </div>
              
              {/* Financial information */}
              <div className="col-span-1 flex items-center">
                <CreditCard className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Subtotal:</div>
                  <div className="text-xs">{formatCurrency(bill.subTotal)}</div>
                </div>
              </div>
              
              <div className="col-span-1 flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground">IVA ({bill.tax_rate}%):</div>
                  <div className="text-xs">{formatCurrency(bill.taxAmount)}</div>
                </div>
              </div>
              
              {/* Total amount */}
              <div className="col-span-2 flex justify-between items-center pt-1 mt-1 border-t border-border/40">
                <span className="text-xs font-medium text-muted-foreground">Total:</span>
                <span className="text-sm font-semibold">{formatCurrency(bill.total)}</span>
              </div>
              
              {/* Items count if available */}
              {bill.items && (
                <div className="col-span-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />
                  {bill.items.length} {bill.items.length === 1 ? 'concepto' : 'conceptos'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
