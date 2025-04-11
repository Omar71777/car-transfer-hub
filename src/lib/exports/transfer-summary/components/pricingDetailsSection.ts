
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';

/**
 * Generates the HTML for the pricing details section
 */
export function renderPricingDetailsSection(
  transfer: Transfer, 
  basePrice: number,
  totalExtraCharges: number,
  discountAmount: number,
  subtotalAfterDiscount: number,
  commissionAmount: number,
  totalPrice: number
): string {
  const validExtraCharges = transfer.extraCharges || [];
  
  return `
  <div class="card">
    <h2>Detalles de Precios</h2>
    <div>
      ${transfer.serviceType === 'dispo' ? `
      <div class="flex-between">
        <div>Precio base (${transfer.price}€ × ${transfer.hours} horas)</div>
        <div>${formatCurrency(basePrice)}</div>
      </div>
      ` : `
      <div class="flex-between">
        <div>Precio base</div>
        <div>${formatCurrency(basePrice)}</div>
      </div>
      `}
      
      ${transfer.discountType && transfer.discountValue ? `
      <div class="flex-between" style="color: #22c55e;">
        <div>Descuento ${transfer.discountType === 'percentage' ? `(${transfer.discountValue}%)` : ''}</div>
        <div>-${formatCurrency(discountAmount)}</div>
      </div>
      ` : ''}
      
      <div class="separator"></div>
      
      ${validExtraCharges.length > 0 ? 
        validExtraCharges.map(charge => `
        <div class="flex-between">
          <div>${charge.name}</div>
          <div>${formatCurrency(Number(charge.price) || 0)}</div>
        </div>
        `).join('') + `
        <div class="flex-between" style="font-weight: 500;">
          <div>Subtotal cargos extra</div>
          <div>${formatCurrency(totalExtraCharges)}</div>
        </div>
        ` : ''}
      
      <div class="separator"></div>
      
      <div class="flex-between" style="font-weight: 600;">
        <div>Subtotal</div>
        <div>${formatCurrency(subtotalAfterDiscount)}</div>
      </div>
      
      ${commissionAmount > 0 ? `
      <div class="flex-between" style="color: #f59e0b;">
        <div>Comisión colaborador ${transfer.commissionType === 'percentage' ? `(${transfer.commission}%)` : ''}</div>
        <div>-${formatCurrency(commissionAmount)}</div>
      </div>
      ` : ''}
      
      <div class="separator"></div>
      
      <div class="flex-between" style="font-weight: 700;">
        <div>TOTAL</div>
        <div>${formatCurrency(totalPrice)}</div>
      </div>
    </div>
  </div>
  `;
}
