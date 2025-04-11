
import { Transfer } from '@/types';
import { formatDate } from '../utils';

/**
 * Generates the HTML for the service details section
 */
export function renderServiceDetailsSection(transfer: Transfer): string {
  return `
  <div class="card">
    <h2>Detalles del Servicio</h2>
    <div class="grid">
      <div>
        <div class="label">Tipo de servicio</div>
        <div class="value">${transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</div>
      </div>
      <div>
        <div class="label">Fecha y hora</div>
        <div class="value">${formatDate(transfer.date)} ${transfer.time || ''}</div>
      </div>
      
      ${transfer.serviceType === 'transfer' ? `
      <div>
        <div class="label">Origen</div>
        <div class="value">${transfer.origin}</div>
      </div>
      <div>
        <div class="label">Destino</div>
        <div class="value">${transfer.destination || ''}</div>
      </div>
      ` : `
      <div>
        <div class="label">Punto de inicio</div>
        <div class="value">${transfer.origin}</div>
      </div>
      <div>
        <div class="label">Horas contratadas</div>
        <div class="value">${transfer.hours} ${Number(transfer.hours) === 1 ? 'hora' : 'horas'}</div>
      </div>
      `}
      
      <div>
        <div class="label">Estado de pago</div>
        <div class="value">${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de pago'}</div>
      </div>
    </div>
  </div>
  `;
}
