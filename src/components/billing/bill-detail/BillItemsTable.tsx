import React from 'react';
import { Bill } from '@/types/billing';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateForBill } from '@/lib/billing/calculationUtils';

interface BillItemsTableProps {
  bill: Bill;
}

export function BillItemsTable({ bill }: BillItemsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatItemDescription = (item: any) => {
    if (item.is_extra_charge) {
      return `Cargos extra: ${item.description}`;
    }
    
    const dateMatch = item.description.match(/(\d{2}\/\d{2}\/\d{4})/);
    const transferMatch = item.description.match(/Traslado/i);
    const dispoMatch = item.description.match(/Disposición/i);
    const discountMatch = item.description.match(/Descuento: (.+?)(\)|$)/);
    
    const formattedDate = dateMatch 
      ? dateMatch[0].split('/').reverse().join('-') 
      : "";
    
    const serviceType = transferMatch ? "Translado" : dispoMatch ? "Disposición" : "";
    
    const discountInfo = discountMatch 
      ? `descuento de ${discountMatch[1]}` 
      : "";
    
    let formattedDescription = formattedDate;
    
    if (serviceType) {
      formattedDescription += formattedDescription 
        ? ` | ${serviceType}` 
        : serviceType;
    }
    
    if (discountInfo) {
      formattedDescription += discountInfo ? ` - ${discountInfo}` : "";
    }
    
    return formattedDescription || item.description;
  };

  const calculateDiscount = (item: any): number => {
    if (item.is_extra_charge) return 0;
    
    const fullPrice = item.unit_price * item.quantity;
    const discount = fullPrice - item.total_price;
    
    return discount > 0 ? discount : 0;
  };

  console.log('Rendering BillItemsTable with:', {
    billId: bill.id,
    itemsCount: bill.items?.length || 0,
    itemsDetails: bill.items?.map(item => ({
      id: item.id, 
      description: item.description,
      is_extra_charge: item.is_extra_charge,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.total_price,
      calculated_discount: (item.unit_price * item.quantity) - item.total_price
    }))
  });

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Detalles de la factura</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Precio unitario
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bill.items && bill.items.length > 0 ? (
                bill.items.map((item, index) => {
                  const discount = calculateDiscount(item);
                  
                  return (
                    <tr key={item.id} className={item.is_extra_charge ? "bg-muted/10" : ""}>
                      <td className={`px-3 py-2 text-sm ${item.is_extra_charge ? "pl-6 text-muted-foreground italic" : "font-medium"}`}>
                        {formatItemDescription(item)}
                      </td>
                      <td className="px-3 py-2 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2 text-sm text-right">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-3 py-2 text-sm text-right">
                        {discount > 0 ? formatCurrency(discount) : "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-right">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No hay elementos en esta factura
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-3 py-2"></td>
                <td className="px-3 py-2 text-sm text-right font-medium">
                  Subtotal:
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  {formatCurrency(bill.sub_total)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2"></td>
                <td className="px-3 py-2 text-sm text-right font-medium">
                  IVA ({bill.tax_rate}%) {bill.tax_application === 'included' ? '(incluido)' : ''}:
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  {formatCurrency(bill.tax_amount)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2"></td>
                <td className="px-3 py-2 text-sm text-right font-bold">
                  Total:
                </td>
                <td className="px-3 py-2 text-sm text-right font-bold">
                  {formatCurrency(bill.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {bill.notes && (
          <div className="mt-4 p-3 bg-muted/20 rounded-md">
            <h4 className="text-sm font-medium mb-1">Notas:</h4>
            <p className="text-sm text-muted-foreground">{bill.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
