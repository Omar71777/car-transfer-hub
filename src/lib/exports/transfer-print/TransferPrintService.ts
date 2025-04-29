
import { Transfer } from '@/types';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import { printHtmlContent } from '@/lib/print/printService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Print a list of transfers with unified formatting
 */
export function printTransfersList(transfers: Transfer[], options: PrintOptions) {
  // Filter transfers based on options
  let filteredTransfers = [...transfers];
  
  // Apply type filter
  if (options.type === 'unpaid') {
    filteredTransfers = filteredTransfers.filter(t => t.paymentStatus === 'pending');
  }
  else if (options.type === 'collaborator') {
    if (options.filterValue) {
      filteredTransfers = filteredTransfers.filter(t => t.collaborator === options.filterValue);
    } else {
      // Only transfers with any collaborator
      filteredTransfers = filteredTransfers.filter(t => t.collaborator && t.collaborator.trim() !== '');
    }
  }
  else if (options.type === 'client') {
    if (options.filterValue) {
      filteredTransfers = filteredTransfers.filter(t => t.client?.name === options.filterValue);
    }
  }
  
  // Prepare titles and subtitles
  let title = 'Lista de Transfers';
  let subtitle = '';
  
  switch (options.type) {
    case 'unpaid':
      title = 'Transfers Pendientes de Pago';
      break;
    case 'collaborator':
      title = 'Transfers por Colaborador';
      subtitle = options.filterValue ? `Colaborador: ${options.filterValue}` : 'Todos los colaboradores';
      break;
    case 'client':
      title = 'Transfers por Cliente';
      subtitle = options.filterValue ? `Cliente: ${options.filterValue}` : 'Todos los clientes';
      break;
  }
  
  // Calculate totals
  const totalPrice = filteredTransfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
  const totalCommissions = filteredTransfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
  const netTotal = totalPrice - totalCommissions;
  
  // Generate table headers based on options
  let tableHeaders = `
    <tr>
      <th>Fecha</th>
      <th>Tipo</th>
      <th>Origen</th>
      <th>Destino</th>
  `;
  
  if (options.type !== 'client') {
    tableHeaders += `<th>Cliente</th>`;
  }
  
  if (options.showCollaborators && options.type !== 'collaborator') {
    tableHeaders += `<th>Colaborador</th>`;
  }
  
  tableHeaders += `
    <th class="text-right">Precio</th>
  `;
  
  if (options.showCommissions) {
    tableHeaders += `<th class="text-right">Comisión</th>`;
  }
  
  tableHeaders += `
    <th class="text-right">Total</th>
    <th>Estado</th>
    </tr>
  `;
  
  // Generate table rows
  let tableRows = '';
  
  filteredTransfers.forEach(transfer => {
    const totalPrice = calculateTotalPrice(transfer);
    const commissionAmount = calculateCommissionAmount(transfer);
    const netTotal = totalPrice - commissionAmount;
    
    tableRows += `<tr>
      <td>${transfer.date}</td>
      <td>${transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</td>
      <td>${transfer.origin}</td>
      <td>${transfer.serviceType === 'transfer' ? (transfer.destination || '-') : (transfer.hours + ' horas')}</td>
    `;
    
    if (options.type !== 'client') {
      tableRows += `<td>${transfer.client?.name || '-'}</td>`;
    }
    
    if (options.showCollaborators && options.type !== 'collaborator') {
      tableRows += `<td>${transfer.collaborator || 'Propio'}</td>`;
    }
    
    tableRows += `
      <td class="text-right">${formatCurrency(totalPrice)}</td>
    `;
    
    if (options.showCommissions) {
      tableRows += `<td class="text-right">${formatCurrency(commissionAmount)}</td>`;
    }
    
    tableRows += `
      <td class="text-right">${formatCurrency(netTotal)}</td>
      <td>
        <span class="${transfer.paymentStatus === 'paid' ? 'status-badge status-paid' : 'status-badge status-pending'}">
          ${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
        </span>
      </td>
    </tr>`;
  });
  
  // Summary information
  const summaryHTML = `
    <div class="summary-section">
      <h3 class="card-title">Resumen</h3>
      <table>
        <tr>
          <td><strong>Total transfers:</strong></td>
          <td>${filteredTransfers.length}</td>
        </tr>
        <tr>
          <td><strong>Total precio:</strong></td>
          <td>${formatCurrency(totalPrice)}</td>
        </tr>
        ${options.showCommissions ? `
        <tr>
          <td><strong>Total comisiones:</strong></td>
          <td>${formatCurrency(totalCommissions)}</td>
        </tr>
        ` : ''}
        <tr class="font-bold">
          <td><strong>Total neto:</strong></td>
          <td>${formatCurrency(netTotal)}</td>
        </tr>
      </table>
    </div>
  `;
  
  // Generate the final HTML content
  const htmlContent = `
    <div class="transfers-report">
      <table class="items-table">
        <thead>
          ${tableHeaders}
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      
      ${summaryHTML}
    </div>
  `;
  
  // Use our new print service to print
  printHtmlContent(
    htmlContent,
    title,
    {
      subtitle,
      fileName: `transfers_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
      showPdfExport: true,
      orientation: 'landscape'
    }
  );
}

/**
 * Print a transfer summary using the unified print service
 */
export function printTransferSummary(transfer: Transfer): void {
  if (!transfer) return;
  
  const basePrice = transfer.serviceType === 'dispo' 
    ? Number(transfer.price) * Number(transfer.hours || 1) 
    : Number(transfer.price);
    
  const validExtraCharges = transfer.extraCharges || [];
  const totalExtraCharges = validExtraCharges.reduce((sum, charge) => {
    return sum + (typeof charge.price === 'number' ? charge.price : Number(charge.price) || 0);
  }, 0);
  
  let discountAmount = 0;
  if (transfer.discountType && transfer.discountValue) {
    if (transfer.discountType === 'percentage') {
      discountAmount = basePrice * (Number(transfer.discountValue) / 100);
    } else {
      discountAmount = Number(transfer.discountValue);
    }
  }
  
  const subtotalAfterDiscount = basePrice + totalExtraCharges - discountAmount;
  const commissionAmountEuros = calculateCommissionAmount(transfer);
  const totalPrice = calculateTotalPrice(transfer);
  
  // Generate client section if available
  const clientSection = transfer.client ? `
    <div class="card keep-together">
      <h3 class="card-title">Cliente</h3>
      <p class="font-bold">${transfer.client.name}</p>
      ${transfer.client.email ? `<p>${transfer.client.email}</p>` : ''}
      ${transfer.client.phone ? `<p>Tel: ${transfer.client.phone}</p>` : ''}
      ${transfer.client.address ? `<p>${transfer.client.address}</p>` : ''}
    </div>
  ` : '';
  
  // Generate service details section
  const serviceDetailsSection = `
    <div class="card keep-together">
      <h3 class="card-title">Detalles del Servicio</h3>
      <table>
        <tr>
          <td>Tipo de Servicio:</td>
          <td>${transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</td>
        </tr>
        <tr>
          <td>Fecha:</td>
          <td>${transfer.date}</td>
        </tr>
        ${transfer.time ? `
          <tr>
            <td>Hora:</td>
            <td>${transfer.time}</td>
          </tr>
        ` : ''}
        <tr>
          <td>Origen:</td>
          <td>${transfer.origin}</td>
        </tr>
        <tr>
          <td>${transfer.serviceType === 'transfer' ? 'Destino' : 'Horas'}:</td>
          <td>${transfer.serviceType === 'transfer' ? transfer.destination : transfer.hours}</td>
        </tr>
        <tr>
          <td>Estado de Pago:</td>
          <td>
            <span class="${transfer.paymentStatus === 'paid' ? 'status-badge status-paid' : 'status-badge status-pending'}">
              ${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
            </span>
          </td>
        </tr>
      </table>
    </div>
  `;
  
  // Generate collaborator section if available
  const collaboratorSection = transfer.collaborator ? `
    <div class="card keep-together">
      <h3 class="card-title">Colaborador</h3>
      <table>
        <tr>
          <td>Nombre:</td>
          <td>${transfer.collaborator}</td>
        </tr>
        <tr>
          <td>Comisión:</td>
          <td>${transfer.commission}%</td>
        </tr>
        <tr>
          <td>Importe Comisión:</td>
          <td>${formatCurrency(commissionAmountEuros)}</td>
        </tr>
      </table>
    </div>
  ` : '';
  
  // Generate pricing section
  const pricingSection = `
    <div class="card keep-together">
      <h3 class="card-title">Detalles de Precio</h3>
      <table class="totals-table">
        <tr>
          <td>Precio Base:</td>
          <td class="text-right">${formatCurrency(basePrice)}</td>
        </tr>
        
        ${totalExtraCharges > 0 ? `
          <tr>
            <td>Cargos Extra:</td>
            <td class="text-right">${formatCurrency(totalExtraCharges)}</td>
          </tr>
        ` : ''}
        
        ${discountAmount > 0 ? `
          <tr>
            <td>Descuento:</td>
            <td class="text-right">- ${formatCurrency(discountAmount)}</td>
          </tr>
        ` : ''}
        
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">${formatCurrency(subtotalAfterDiscount)}</td>
        </tr>
        
        ${commissionAmountEuros > 0 ? `
          <tr>
            <td>Comisión:</td>
            <td class="text-right">- ${formatCurrency(commissionAmountEuros)}</td>
          </tr>
        ` : ''}
        
        <tr class="total-row">
          <td>Total:</td>
          <td class="text-right">${formatCurrency(totalPrice)}</td>
        </tr>
      </table>
    </div>
  `;
  
  // Generate expenses section if available
  let expensesSection = '';
  if (transfer.expenses && transfer.expenses.length > 0) {
    const totalExpenses = transfer.expenses.reduce((sum, expense) => {
      return sum + (typeof expense.amount === 'number' ? expense.amount : Number(expense.amount) || 0);
    }, 0);
    
    expensesSection = `
      <div class="card keep-together">
        <h3 class="card-title">Gastos</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th class="text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            ${transfer.expenses.map(expense => `
              <tr>
                <td>${expense.date}</td>
                <td>${expense.concept}</td>
                <td class="text-right">${formatCurrency(expense.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="font-bold">
              <td colspan="2">Total Gastos:</td>
              <td class="text-right">${formatCurrency(totalExpenses)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
  
  // Combine all sections into the final HTML content
  const htmlContent = `
    ${clientSection}
    ${serviceDetailsSection}
    ${collaboratorSection}
    ${pricingSection}
    ${expensesSection}
  `;
  
  // Use our new print service to print
  printHtmlContent(
    htmlContent,
    `Detalle del Transfer: ${transfer.origin} - ${transfer.serviceType === 'transfer' ? transfer.destination : transfer.hours + ' horas'}`,
    {
      subtitle: `Fecha: ${transfer.date}`,
      fileName: `transfer_${transfer.id.substring(0, 8)}.pdf`,
      showPdfExport: true
    }
  );
}

/**
 * Print collaborator commission summary using the unified print service
 */
export function printCollaboratorCommissionSummary(transfers: Transfer[]) {
  // Group transfers by collaborator
  const collaboratorStats: Record<string, {
    name: string,
    transferCount: number,
    commissionTotal: number,
    transfers: Transfer[]
  }> = {};
  
  // Filter out transfers without collaborators
  const transfersWithCollaborators = transfers.filter(transfer => 
    transfer.collaborator && transfer.collaborator.trim() !== ''
  );
  
  transfersWithCollaborators.forEach(transfer => {
    if (!transfer.collaborator) return;
    
    // Standardize the collaborator name to lowercase for comparison
    const normalizedName = transfer.collaborator.toLowerCase();
    // But preserve the original casing for display (using the first occurrence)
    const displayName = collaboratorStats[normalizedName] 
      ? collaboratorStats[normalizedName].name 
      : transfer.collaborator;
    
    // Calculate commission amount
    const commissionAmount = calculateCommissionAmount(transfer);
    
    if (!collaboratorStats[normalizedName]) {
      collaboratorStats[normalizedName] = {
        name: displayName,
        transferCount: 0,
        commissionTotal: 0,
        transfers: []
      };
    }
    
    collaboratorStats[normalizedName].transferCount += 1;
    collaboratorStats[normalizedName].commissionTotal += commissionAmount;
    collaboratorStats[normalizedName].transfers.push(transfer);
  });
  
  // Generate collaborator cards HTML
  let collaboratorCardsHTML = '';
  
  Object.values(collaboratorStats).forEach(collab => {
    // Calculate average commission
    const averageCommission = collab.transferCount > 0 
      ? collab.commissionTotal / collab.transferCount 
      : 0;
    
    collaboratorCardsHTML += `
      <div class="card keep-together">
        <h3 class="card-title">${collab.name}</h3>
        
        <table>
          <tr>
            <td>Transfers:</td>
            <td><strong>${collab.transferCount}</strong></td>
          </tr>
          <tr>
            <td>Comisión Total:</td>
            <td><strong>${formatCurrency(collab.commissionTotal)}</strong></td>
          </tr>
          <tr>
            <td>Comisión Media:</td>
            <td><strong>${formatCurrency(averageCommission)}</strong></td>
          </tr>
        </table>
      </div>
    `;
  });
  
  // Use our new print service to print
  printHtmlContent(
    collaboratorCardsHTML,
    'Resumen de Comisiones por Colaborador',
    {
      fileName: `comisiones_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
      showPdfExport: true
    }
  );
}
