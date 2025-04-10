
import React from 'react';
import { format } from 'date-fns';
import { Bill } from '@/types/billing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Download, Send } from 'lucide-react';

interface BillDetailProps {
  bill: Bill;
  onPrint: () => void;
  onDownload: () => void;
  onStatusChange: (status: Bill['status']) => void;
}

export function BillDetail({ bill, onPrint, onDownload, onStatusChange }: BillDetailProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Factura {bill.number}</h2>
          <div className="flex items-center mt-1 space-x-2">
            {getBillStatusBadge(bill.status)}
            <span className="text-sm text-muted-foreground">
              Creada el {format(new Date(bill.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button size="sm" variant="outline" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
          {bill.status === 'draft' && (
            <Button size="sm" onClick={() => onStatusChange('sent')}>
              <Send className="h-4 w-4 mr-2" />
              Marcar como enviada
            </Button>
          )}
          {bill.status === 'sent' && (
            <Button size="sm" onClick={() => onStatusChange('paid')}>
              Marcar como pagada
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Información de la factura</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Número de factura:</span>
                <span>{bill.number}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Fecha de emisión:</span>
                <span>{bill.date}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Fecha de vencimiento:</span>
                <span>{bill.dueDate}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Estado:</span>
                <span>{getBillStatusBadge(bill.status)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Información del cliente</h3>
            {bill.client ? (
              <div className="space-y-2 text-sm">
                <div className="font-medium">{bill.client.name}</div>
                <div>{bill.client.email}</div>
                {bill.client.phone && <div>{bill.client.phone}</div>}
                {bill.client.address && <div>{bill.client.address}</div>}
                {bill.client.taxId && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">NIF/CIF:</span>
                    <span>{bill.client.taxId}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Cliente no disponible</div>
            )}
          </CardContent>
        </Card>
      </div>

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
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-sm">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-sm text-right">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-sm text-right font-medium">
                    Subtotal:
                  </td>
                  <td className="px-3 py-2 text-sm text-right">
                    {formatCurrency(bill.subTotal)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-sm text-right font-medium">
                    IVA ({bill.taxRate}%) {bill.taxApplication === 'included' ? '(incluido)' : ''}:
                  </td>
                  <td className="px-3 py-2 text-sm text-right">
                    {formatCurrency(bill.taxAmount)}
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
    </div>
  );
}
