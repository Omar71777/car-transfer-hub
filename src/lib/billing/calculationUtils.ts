import { Transfer } from '@/types';
import { Client } from '@/types/client';
import { BillPreview, TaxApplicationType } from '@/types/billing';
import { MinimalTransfer } from '@/lib/calculations';

/**
 * Generates a transfer description for billing based on service type
 */
export function generateTransferDescription(transfer: Transfer, extraCharges?: any[]): string {
  let description = '';
  
  // Format date properly (DD/MM/YYYY)
  const formattedDate = formatDateForBill(transfer.date);
  
  // Base description depends on service type
  if (transfer.serviceType === 'dispo') {
    description = `${formattedDate}, Servicio de disposición por horas`;
  } else {
    description = `${formattedDate}, Traslado: ${transfer.origin} → ${transfer.destination}`;
  }
  
  return description;
}

/**
 * Formats date as DD/MM/YYYY for bill display
 */
export function formatDateForBill(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    // Return original if formatting fails
    return dateString;
  }
}

/**
 * Generates a description for an extra charge
 */
export function generateExtraChargeDescription(chargeName: string): string {
  return `Cargo extra: ${chargeName}`;
}

/**
 * Creates a bill preview object with all needed data
 */
export function createBillPreview(
  client: Client,
  items: {
    transfer: Transfer;
    description: string;
    unitPrice: number;
    extraCharges?: {
      id: string;
      name: string;
      price: number;
    }[];
  }[],
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
    total
  };
}

/**
 * Formats transfer data for calculations
 */
export function formatTransferForCalculations(transfer: Transfer): MinimalTransfer {
  return {
    serviceType: transfer.serviceType,
    price: transfer.price,
    hours: transfer.hours,
    discountType: transfer.discountType,
    discountValue: transfer.discountValue,
    // Add commission related fields that exist in MinimalTransfer
    commission: transfer.commission,
    commissionType: transfer.commissionType,
    // Other optional fields
    destination: transfer.destination,
    origin: transfer.origin,
    date: transfer.date
  };
}

/**
 * Calculates tax amounts and total based on tax application method
 */
export function calculateTaxTotals(
  subTotal: number, 
  taxRate: number, 
  taxApplication: TaxApplicationType
): { taxAmount: number; total: number } {
  let taxAmount = 0;
  let total = 0;

  if (taxApplication === 'included') {
    // Tax is included in the price
    taxAmount = (subTotal * taxRate) / (100 + taxRate);
    total = subTotal;
  } else {
    // Tax is added on top of the price
    taxAmount = (subTotal * taxRate) / 100;
    total = subTotal + taxAmount;
  }

  return { taxAmount, total };
}
