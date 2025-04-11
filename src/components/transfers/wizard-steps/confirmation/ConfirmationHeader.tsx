
import React from 'react';
import { Check } from 'lucide-react';

export function ConfirmationHeader() {
  return (
    <div className="text-center mb-6">
      <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
        <Check className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold">Confirma los detalles del servicio</h2>
      <p className="text-muted-foreground mt-1">
        Revisa toda la información antes de completar
      </p>
    </div>
  );
}
