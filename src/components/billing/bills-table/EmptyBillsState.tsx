
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyBillsStateProps {
  onAdd: () => void;
}

export function EmptyBillsState({ onAdd }: EmptyBillsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-muted-foreground mb-4">No hay facturas registradas.</p>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Crear Factura
      </Button>
    </div>
  );
}
