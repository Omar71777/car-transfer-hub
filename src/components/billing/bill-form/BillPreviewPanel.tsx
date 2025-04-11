
import React from 'react';
import { BillPreview } from '@/types/billing';

interface BillPreviewPanelProps {
  billPreview: BillPreview | null;
  formatCurrency: (amount: number) => string;
}

export function BillPreviewPanel({ billPreview, formatCurrency }: BillPreviewPanelProps) {
  if (!billPreview) return null;
  
  // Function to check if a description contains discount information
  const hasDiscount = (description: string) => {
    return description.includes('Descuento:');
  };
  
  // Extract discount from description
  const extractDiscountInfo = (description: string) => {
    const match = description.match(/Descuento: (.+?)(\)|$)/);
    return match ? match[1] : '';
  };
  
  // Format the description to show date - service - discount
  const formatItemDescription = (description: string) => {
    // Extract components
    const dateMatch = description.match(/(\d{2}\/\d{2}\/\d{4})/);
    const transferMatch = description.match(/Traslado/i);
    const dispoMatch = description.match(/Disposición/i);
    
    // Format components
    const date = dateMatch ? dateMatch[0] : "";
    const serviceType = transferMatch ? "Traslado" : dispoMatch ? "Disposición" : "";
    
    // Create formatted description in the order: date - service
    let formattedDescription = "";
    
    if (date) {
      formattedDescription += date;
    }
    
    if (serviceType) {
      formattedDescription += formattedDescription ? ` - ${serviceType}` : serviceType;
    }
    
    return formattedDescription || description;
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
                {hasDiscount(item.description) ? 
                  formatItemDescription(item.description.replace(/\s*\(Descuento:.*?\)/, '')) : 
                  formatItemDescription(item.description)}
              </span>
              <span>{formatCurrency(item.unitPrice)}</span>
            </div>
            
            {/* Show discount if present in description */}
            {hasDiscount(item.description) && (
              <div className="pl-3 text-xs text-green-600 flex justify-between">
                <span>Descuento: {extractDiscountInfo(item.description)}</span>
              </div>
            )}
            
            {/* Extra charges for this item */}
            {item.extraCharges && item.extraCharges.length > 0 && (
              <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                {item.extraCharges.map((charge, chargeIndex) => (
                  <div key={chargeIndex} className="flex justify-between">
                    <span>{charge.name}</span>
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
