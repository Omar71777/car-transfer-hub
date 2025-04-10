
import { Transfer, ExtraCharge } from '@/types';

// Define a minimal interface with only the fields needed for calculations
export interface MinimalTransfer {
  serviceType?: string;
  price?: number;
  hours?: number | string;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  commission?: number;
  commissionType?: 'percentage' | 'fixed';
  extraCharges?: ExtraCharge[];
  destination?: string;
  origin?: string;
  date?: string;
}

/**
 * Calculates the base price for a transfer, taking into account service type (dispo multiplies by hours)
 */
export const calculateBasePrice = (transfer: MinimalTransfer | Transfer): number => {
  if (!transfer) return 0;
  
  const price = Number(transfer.price) || 0;
  
  // For dispo service, multiply price by hours
  if (transfer.serviceType === 'dispo' && transfer.hours) {
    return price * Number(transfer.hours);
  }
  
  return price;
};

/**
 * Adapts database extra charges to match our ExtraCharge interface
 */
export const adaptExtraCharges = (charges: any[]): ExtraCharge[] => {
  if (!charges || !Array.isArray(charges)) return [];
  
  return charges.map(charge => ({
    id: charge.id || '',
    transferId: charge.transfer_id || '',
    name: charge.name || '',
    price: typeof charge.price === 'string' ? Number(charge.price) : (charge.price || 0)
  }));
};

/**
 * Calculates total extra charges for a transfer
 */
export const calculateExtraChargesTotal = (extraCharges: ExtraCharge[] | any[] = []): number => {
  if (!extraCharges || !Array.isArray(extraCharges)) return 0;
  
  return extraCharges.reduce((sum, charge) => {
    // Handle both ExtraCharge format and database format
    const price = charge.price !== undefined ? charge.price : 0;
    const chargePrice = typeof price === 'string' ? Number(price) : (price || 0);
    return sum + chargePrice;
  }, 0); // Explicitly provide 0 as the initial value
};

/**
 * Calculates the discount amount based on discount type and value
 */
export const calculateDiscountAmount = (transfer: MinimalTransfer | Transfer): number => {
  if (!transfer.discountType || !transfer.discountValue) return 0;
  
  const basePrice = calculateBasePrice(transfer);
  
  if (transfer.discountType === 'percentage') {
    return basePrice * (Number(transfer.discountValue) / 100);
  } else {
    return Number(transfer.discountValue);
  }
};

/**
 * Calculates the commission amount based on commission type and value
 */
export const calculateCommissionAmount = (transfer: MinimalTransfer | Transfer): number => {
  if (!transfer || !transfer.commission) return 0;
  
  const totalPriceBeforeCommission = calculateTotalPrice(transfer);
  
  if (!transfer.commissionType || transfer.commissionType === 'percentage') {
    return totalPriceBeforeCommission * (Number(transfer.commission) / 100);
  } else {
    return Number(transfer.commission);
  }
};

/**
 * Calculates the total price including extra charges and discounts
 */
export const calculateTotalPrice = (transfer: MinimalTransfer | Transfer): number => {
  if (!transfer) return 0;
  
  const basePrice = calculateBasePrice(transfer);
  const extraChargesTotal = calculateExtraChargesTotal(transfer.extraCharges);
  const discountAmount = calculateDiscountAmount(transfer);
  
  return basePrice + extraChargesTotal - discountAmount;
};
