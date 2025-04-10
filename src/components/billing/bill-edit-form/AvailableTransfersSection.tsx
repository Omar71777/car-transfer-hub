
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { Transfer } from '@/types';

interface AvailableTransfersSectionProps {
  transfersToAdd: string[];
  availableTransfers: Transfer[];
  getAddableTransfers: () => Transfer[];
  toggleTransferToAdd: (transferId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function AvailableTransfersSection({
  transfersToAdd,
  availableTransfers,
  getAddableTransfers,
  toggleTransferToAdd,
  formatCurrency
}: AvailableTransfersSectionProps) {
  return (
    <>
      <h3 className="font-medium">Añadir transfers</h3>
      
      {/* Display transfers to add */}
      {transfersToAdd.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium">Transfers seleccionados para añadir:</h4>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {transfersToAdd.map(transferId => {
              const transfer = availableTransfers.find(t => t.id === transferId);
              if (!transfer) return null;
              
              return (
                <div key={transfer.id} className="flex items-center justify-between p-2 border rounded-md bg-green-50 border-green-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                    <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleTransferToAdd(transfer.id)}
                  >
                    <Minus className="h-4 w-4 mr-1" /> Quitar
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Available transfers to add */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Transfers disponibles:</h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {getAddableTransfers().length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay transfers disponibles para añadir</p>
          ) : (
            getAddableTransfers().map(transfer => (
              <div key={transfer.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                  <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTransferToAdd(transfer.id)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Añadir
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
