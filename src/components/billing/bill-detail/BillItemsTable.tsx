
import React from 'react';
import { Bill } from '@/types/billing';
import { Card, CardContent } from '@/components/ui/card';

interface BillItemsTableProps {
  bill: Bill;
}

export function BillItemsTable({ bill }: BillItemsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

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
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Precio unitario
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bill.items && bill.items.map((item) => (
                <React.Fragment key={item.id}>
                  {/* Main transfer item */}
                  <tr>
                    <td className="px-3 py-2 text-sm font-medium">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {formatCurrency(item.total_price)}
                    </td>
                  </tr>
                  
                  {/* Extra charges for this item */}
                  {item.extra_charges && item.extra_charges.map((charge) => (
                    <tr key={charge.id} className="bg-muted/10">
                      <td className="px-3 py-1 text-sm pl-6">
                        <span className="text-muted-foreground">{charge.name}</span>
                      </td>
                      <td className="px-3 py-1 text-sm text-right">
                        1
                      </td>
                      <td className="px-3 py-1 text-sm text-right">
                        {formatCurrency(charge.price)}
                      </td>
                      <td className="px-3 py-1 text-sm text-right">
                        {formatCurrency(charge.price)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="px-3 py-2"></td>
                <td className="px-3 py-2 text-sm text-right font-medium">
                  Subtotal:
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  {formatCurrency(bill.sub_total)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-3 py-2"></td>
                <td className="px-3 py-2 text-sm text-right font-medium">
                  IVA ({bill.tax_rate}%) {bill.tax_application === 'included' ? '(incluido)' : ''}:
                </td>
                <td className="px-3 py-2 text-sm text-right">
                  {formatCurrency(bill.tax_amount)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-3 py-2"></td>
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
