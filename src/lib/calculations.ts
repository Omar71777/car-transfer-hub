/**
 * Calculations utility for transfers and billing
 */

import { ExtraCharge } from '@/types';

export interface MinimalTransfer {
  serviceType: 'transfer' | 'dispo';
  price: number;
  hours?: number | string;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  extraCharges?: ExtraCharge[];
  commission?: number;
  commissionType?: 'percentage' | 'fixed';
  destination?: string;
  origin?: string;
  date?: string;
}

/**
 * Adapts ExtraCharge[] to the format required by calculation functions
 */
export const adaptExtraCharges = (extraCharges: any[]): { price: number }[] => {
  return extraCharges.map(charge => ({
    price: typeof charge.price === 'string' ? parseFloat(charge.price) : charge.price
  }));
};

/**
 * Calculate the base price of a transfer before discounts
 * @param transfer Transfer object with price and hours info
 * @returns Base price (price * hours for dispo, just price for transfer)
 */
export const calculateBasePrice = (transfer: MinimalTransfer): number => {
  if (transfer.serviceType === 'dispo' && transfer.hours) {
    const hours = typeof transfer.hours === 'string' ? parseFloat(transfer.hours) : transfer.hours;
    return transfer.price * (isNaN(hours) ? 1 : hours);
  }
  return transfer.price;
};

/**
 * Calculate discount amount based on discount type and value
 * @param transfer Transfer object with discount info
 * @returns Discount amount in currency
 */
export const calculateDiscountAmount = (transfer: MinimalTransfer): number => {
  const basePrice = calculateBasePrice(transfer);
  
  // Calculate discount amount
  if (transfer.discountType && transfer.discountValue) {
    if (transfer.discountType === 'percentage') {
      return basePrice * (transfer.discountValue / 100);
    } else if (transfer.discountType === 'fixed') {
      return transfer.discountValue;
    }
  }
  
  return 0;
};

/**
 * Calculate the total of all extra charges
 * @param extraCharges Array of extra charges
 * @returns Sum of all extra charges
 */
export const calculateExtraChargesTotal = (extraCharges: ExtraCharge[] = []): number => {
  return extraCharges.reduce((sum, charge) => {
    const chargePrice = typeof charge.price === 'string' ? parseFloat(charge.price) : charge.price;
    return sum + (isNaN(chargePrice) ? 0 : chargePrice);
  }, 0);
};

/**
 * Calculate commission amount based on commission type
 * @param transfer Transfer object with commission info
 * @returns Commission amount in currency
 */
export const calculateCommissionAmount = (transfer: MinimalTransfer): number => {
  if (!transfer.commission || !transfer.commissionType) return 0;

  const basePrice = calculateBasePrice(transfer);
  const discountAmount = calculateDiscountAmount(transfer);
  const extraChargesTotal = calculateExtraChargesTotal(transfer.extraCharges);
  const subtotalBeforeCommission = basePrice - discountAmount + extraChargesTotal;
  
  if (transfer.commissionType === 'percentage') {
    return subtotalBeforeCommission * (transfer.commission / 100);
  } else {
    return transfer.commission;
  }
};

/**
 * Calculate the total price of a transfer including discounts, extra charges, and commission
 * @param transfer Transfer object
 * @returns Total price after all calculations
 */
export const calculateTotalPrice = (transfer: MinimalTransfer): number => {
  const basePrice = calculateBasePrice(transfer);
  const discountAmount = calculateDiscountAmount(transfer);
  const extraChargesTotal = calculateExtraChargesTotal(transfer.extraCharges);
  const commissionAmount = calculateCommissionAmount(transfer);
  
  // Calculate final price: base price - discount + extra charges - commission
  return basePrice - discountAmount + extraChargesTotal - commissionAmount;
};
