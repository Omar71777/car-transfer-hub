import React from 'react';
import { BillPreview } from '@/types/billing';

interface BillPreviewPanelProps {
  billPreview: BillPreview | null;
  formatCurrency: (amount: number) => string;
}

export function BillPreviewPanel({ billPreview, formatCurrency }: BillPreviewPanelProps) {
  if (!billPreview) return null;
  
  const formatItemDescription = (item: any) => {
    // If it's an extra charge, format differently
    if (item.extraCharges || item.is_extra_charge) {
      return `Cargos extra: ${item.description}`;
    }
    
    // Extract date, service type, and discount info
    const dateMatch = item.description.match(/(\d{2}\/\d{2}\/\d{4})/);
    const transferMatch = item.description.match(/Traslado/i);
    const dispoMatch = item.description.match(/Disposición/i);
    const discountMatch = item.description.match(/Descuento: (.+?)(\)|$)/);
    
    // Format date to DD-MM-YYYY
    const formattedDate = dateMatch 
      ? dateMatch[0].split('/').reverse().join('-') 
      : "";
    
    // Determine service type
    const serviceType = transferMatch ? "Translado" : dispoMatch ? "Disposición" : "";
    
    // Format discount
    const discountInfo = discountMatch 
      ? `descuento de ${discountMatch[1]}` 
      : "";
    
    // Create formatted description
    let formattedDescription = formattedDate;
    
    if (serviceType) {
      formattedDescription += formattedDescription 
        ? ` | ${serviceType}` 
        : serviceType;
    }
    
    if (discountInfo) {
      formattedDescription += discountInfo ? ` - ${discountInfo}` : "";
    }
    
    return formattedDescription || item.description;
  };
  
  return (
    <div className="mt-4 border rounded-md p-3 space-y-3">
      <h3 className="font-medium">Resumen de factura</h3>
      
      {/* Items preview */}
      <div className="space-y-2 text-sm">
        {billPreview.items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between">
              <span className="truncate max-w-[250px]">
                {formatItemDescription(item)}
              </span>
              <span>{formatCurrency(item.unitPrice)}</span>
            </div>
            
            {/* Extra charges for this item */}
            {item.extraCharges && item.extraCharges.length > 0 && (
              <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                {item.extraCharges.map((charge, chargeIndex) => (
                  <div key={chargeIndex} className="flex justify-between">
                    <span>Cargos extra: {charge.name}</span>
                    <span>{formatCurrency(charge.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t">
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
    </div>
  );
}
