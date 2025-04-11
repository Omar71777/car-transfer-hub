
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';
import { Transfer } from '@/types';

interface CurrentTransfersSectionProps {
  currentTransfers: Transfer[];
  transfersToRemove: string[];
  toggleTransferToRemove: (transferId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function CurrentTransfersSection({
  currentTransfers,
  transfersToRemove,
  toggleTransferToRemove,
  formatCurrency
}: CurrentTransfersSectionProps) {
  return (
    <>
      <h3 className="font-medium">Transfers actuales</h3>
      {currentTransfers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay transfers en esta factura</p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {currentTransfers.map(transfer => (
            <div 
              key={transfer.id} 
              className={`flex items-center justify-between p-2 border rounded-md ${
                transfersToRemove.includes(transfer.id) ? 'bg-red-50 border-red-200' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                {transfer.discountType && transfer.discountValue > 0 && (
                  <p className="text-xs text-emerald-600">
                    Descuento: {transfer.discountType === 'percentage' ? `${transfer.discountValue}%` : formatCurrency(Number(transfer.discountValue))}
                  </p>
                )}
              </div>
              <Button 
                type="button" 
                variant={transfersToRemove.includes(transfer.id) ? "default" : "destructive"} 
                size="sm"
                onClick={() => toggleTransferToRemove(transfer.id)}
              >
                {transfersToRemove.includes(transfer.id) ? (
                  <>Restaurar</>
                ) : (
                  <><Minus className="h-4 w-4 mr-1" /> Quitar</>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
