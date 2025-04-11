
import React from 'react';

export function BillingHeader() {
  return (
    <div className="mb-8">
      <div className="relative">
        <h1 className="text-3xl font-bold mb-2 text-charcoal dark:text-soft-beige font-display">Facturación</h1>
        <div className="h-1 w-20 bg-warm rounded-full mb-3"></div>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Gestión de facturas para clientes, creación y seguimiento de pagos
      </p>
    </div>
  );
}
