
import { Transfer } from '@/types';

/**
 * Generates the HTML for the client information section
 */
export function renderClientSection(transfer: Transfer): string {
  if (!transfer.client) return '';
  
  return `
  <div class="card">
    <h2>Información del Cliente</h2>
    <div class="grid">
      <div>
        <div class="label">Cliente</div>
        <div class="value">${transfer.client.name}</div>
      </div>
      <div>
        <div class="label">Email</div>
        <div class="value">${transfer.client.email || 'No especificado'}</div>
      </div>
    </div>
  </div>
  `;
}
