
import React from 'react';
import { Bill } from '@/types/billing';
import { Card, CardContent } from '@/components/ui/card';
import { BillStatusBadge } from './BillStatusBadge';

interface BillInfoCardsProps {
  bill: Bill;
}

export function BillInfoCards({ bill }: BillInfoCardsProps) {
  return (
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
              <span>{bill.due_date}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-muted-foreground">Estado:</span>
              <span><BillStatusBadge status={bill.status} /></span>
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
              {bill.client.tax_id && (
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">NIF/CIF:</span>
                  <span>{bill.client.tax_id}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">Cliente no disponible</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
