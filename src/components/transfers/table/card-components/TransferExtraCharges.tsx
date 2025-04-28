
import React from 'react';
import { ExtraCharge } from '@/types';
import { formatCurrency } from '@/lib/format';

interface TransferExtraChargesProps {
  extraCharges: ExtraCharge[];
}

export function TransferExtraCharges({ extraCharges }: TransferExtraChargesProps) {
  if (!extraCharges || extraCharges.length === 0) {
    return null;
  }

  return (
    <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
      <p className="text-xs font-medium text-muted-foreground">Cargos extra:</p>
      {extraCharges.map((charge, idx) => (
        <div key={idx} className="flex justify-between text-xs">
          <span className="text-slate-700">{charge.name}</span>
          <span className="text-slate-700">{formatCurrency(Number(charge.price))}</span>
        </div>
      ))}
    </div>
  );
}
