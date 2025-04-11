
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';

/**
 * Generates the HTML for the collaborator information section
 */
export function renderCollaboratorSection(transfer: Transfer, commissionAmount: number): string {
  if (!transfer.collaborator) return '';
  
  return `
  <div class="card">
    <h2>Información del Colaborador</h2>
    <div class="grid">
      <div>
        <div class="label">Colaborador</div>
        <div class="value">${transfer.collaborator}</div>
      </div>
      <div>
        <div class="label">Comisión</div>
        <div class="value">
          ${transfer.commission}${transfer.commissionType === 'percentage' ? '%' : '€'} 
          <span style="color: #666; font-size: 13px;">
            (${formatCurrency(commissionAmount)})
          </span>
        </div>
      </div>
    </div>
  </div>
  `;
}
