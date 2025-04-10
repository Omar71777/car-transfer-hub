
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Transfer } from '@/types';

interface TransfersListProps {
  filteredTransfers: Transfer[];
  selectedTransfers: string[];
  onTransferToggle: (transferId: string) => void;
  onSelectAllTransfers: () => void;
  transferFilter: string;
  onTransferFilterChange: (value: string) => void;
  formatCurrency: (amount: number) => string;
}

export function TransfersList({
  filteredTransfers,
  selectedTransfers,
  onTransferToggle,
  onSelectAllTransfers,
  transferFilter,
  onTransferFilterChange,
  formatCurrency
}: TransfersListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Transfers a facturar</h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onSelectAllTransfers}
            disabled={filteredTransfers.length === 0}
          >
            {selectedTransfers.length === filteredTransfers.length && filteredTransfers.length > 0 
              ? 'Deseleccionar todos' 
              : 'Seleccionar todos'}
          </Button>
        </div>
      </div>
      
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Filtrar transfers por origen o destino..."
          value={transferFilter}
          onChange={(e) => onTransferFilterChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTransfers.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No hay transfers disponibles para facturar</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
          <div className="divide-y">
            {filteredTransfers.map((transfer) => (
              <div key={transfer.id} className="p-3 hover:bg-accent/10">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id={`transfer-${transfer.id}`}
                    checked={selectedTransfers.includes(transfer.id)}
                    onCheckedChange={() => onTransferToggle(transfer.id)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor={`transfer-${transfer.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {transfer.origin} → {transfer.destination}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      <span>Fecha: {transfer.date}</span>
                      <span className="mx-2">•</span>
                      <span>Precio: {formatCurrency(transfer.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
