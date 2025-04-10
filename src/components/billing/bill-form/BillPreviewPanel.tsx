
import React from 'react';
import { BillPreview } from '@/types/billing';

interface BillPreviewPanelProps {
  billPreview: BillPreview | null;
  formatCurrency: (amount: number) => string;
}

export function BillPreviewPanel({ billPreview, formatCurrency }: BillPreviewPanelProps) {
  if (!billPreview) return null;
  
  return (
    <div className="mt-4 border rounded-md p-3 space-y-2">
      <h3 className="font-medium">Resumen de factura</h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(billPreview.subTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA ({billPreview.taxRate}%):</span>
          <span>{formatCurrency(billPreview.taxAmount)}</span>
        </div>
        <div className="flex justify-between font-medium pt-1 border-t">
          <span>Total:</span>
          <span>{formatCurrency(billPreview.total)}</span>
        </div>
      </div>
    </div>
  );
}
