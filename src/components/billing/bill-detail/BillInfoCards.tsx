
import React from 'react';
import { Bill } from '@/types/billing';
import { Card, CardContent } from '@/components/ui/card';
import { BillStatusBadge } from './BillStatusBadge';
import { useIsMobile } from '@/hooks/use-mobile';

interface BillInfoCardsProps {
  bill: Bill;
}

export function BillInfoCards({ bill }: BillInfoCardsProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card className="glass-card shadow-card hover:shadow-hover">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2 text-primary/90">Información de la factura</h3>
            <div className="rounded-lg border border-border/30 divide-y divide-border/30 overflow-hidden">
              <InfoRow label="Número de factura" value={bill.number} />
              <InfoRow label="Fecha de emisión" value={bill.date} />
              <InfoRow label="Fecha de vencimiento" value={bill.due_date} />
              <InfoRow 
                label="Estado" 
                value={<BillStatusBadge status={bill.status} />} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-card hover:shadow-hover">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2 text-primary/90">Información del cliente</h3>
            {bill.client ? (
              <div className="rounded-lg border border-border/30 divide-y divide-border/30 overflow-hidden">
                <InfoRow label="Cliente" value={bill.client.name} highlight />
                <InfoRow label="Email" value={bill.client.email} />
                {bill.client.phone && (
                  <InfoRow label="Teléfono" value={bill.client.phone} />
                )}
                {bill.client.address && (
                  <InfoRow label="Dirección" value={bill.client.address} />
                )}
                {bill.client.tax_id && (
                  <InfoRow label="NIF/CIF" value={bill.client.tax_id} />
                )}
              </div>
            ) : (
              <div className="text-muted-foreground p-3 bg-muted/10 rounded-lg border border-muted/20 text-center">
                Cliente no disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card shadow-card hover:shadow-hover">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2 text-primary/90">Información de la factura</h3>
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

      <Card className="glass-card shadow-card hover:shadow-hover">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2 text-primary/90">Información del cliente</h3>
          {bill.client ? (
            <div className="space-y-2 text-sm">
              <div className="font-medium text-primary/90">{bill.client.name}</div>
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

// Helper component for mobile info rows
function InfoRow({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: React.ReactNode; 
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col p-3 bg-card">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className={highlight ? "font-medium text-primary" : ""}>{value}</span>
    </div>
  );
}
