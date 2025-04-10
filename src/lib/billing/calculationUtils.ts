
import { BillPreview, TaxApplicationType } from '@/types/billing';
import { 
  calculateBasePrice, 
  calculateDiscountAmount, 
  calculateExtraChargesTotal, 
  adaptExtraCharges,
  MinimalTransfer
} from '@/lib/calculations';

/**
 * Formats a database transfer into a minimal transfer object for calculations
 */
export function formatTransferForCalculations(transfer: any): MinimalTransfer {
  return {
    serviceType: transfer.service_type || 'transfer',
    price: Number(transfer.price),
    hours: transfer.hours || undefined,
    discountType: transfer.discount_type,
    discountValue: Number(transfer.discount_value) || 0,
    destination: transfer.destination,
    origin: transfer.origin,
    date: transfer.date,
    extraCharges: [],
    commission: Number(transfer.commission) || 0,
    commissionType: transfer.commission_type || 'percentage'
  };
}

/**
 * Generates a description for a transfer based on its properties
 */
export function generateTransferDescription(transfer: any, extraCharges: any[] = []): string {
  let description = '';
  
  if (transfer.service_type === 'transfer') {
    description = `Transfer desde ${transfer.origin} hasta ${transfer.destination} el ${transfer.date}`;
  } else {
    description = `Servicio de disposición por ${transfer.hours} horas desde ${transfer.origin} el ${transfer.date}`;
  }
  
  // Add extra charges description if any
  if (extraCharges && extraCharges.length > 0) {
    description += ` (incluye ${extraCharges.length} cargo${extraCharges.length !== 1 ? 's' : ''} extra${extraCharges.length !== 1 ? 's' : ''})`;
  }
  
  // Add discount description if any
  if (transfer.discount_type && transfer.discount_value) {
    const discountDesc = transfer.discount_type === 'percentage' 
      ? `${transfer.discount_value}%` 
      : `${transfer.discount_value}€`;
    description += ` (descuento de ${discountDesc})`;
  }
  
  return description;
}

/**
 * Calculates the tax amount and final total based on tax application type
 */
export function calculateTaxTotals(
  subTotal: number,
  taxRate: number,
  taxApplication: TaxApplicationType
): { taxAmount: number; total: number } {
  let taxAmount = 0;
  let total = 0;

  if (taxApplication === 'included') {
    taxAmount = (subTotal * taxRate) / (100 + taxRate);
    total = subTotal;
  } else {
    taxAmount = (subTotal * taxRate) / 100;
    total = subTotal + taxAmount;
  }

  return { taxAmount, total };
}

/**
 * Creates a bill preview object from all the calculated data
 */
export function createBillPreview(
  client: any,
  items: any[],
  subTotal: number,
  taxRate: number,
  taxAmount: number, 
  taxApplication: TaxApplicationType,
  total: number
): BillPreview {
  return {
    client,
    items,
    subTotal,
    taxRate,
    taxAmount,
    taxApplication,
    total,
  };
}
