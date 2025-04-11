
import { Transfer } from '@/types';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';

// Prepare styles for print
const getStyles = () => `
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    padding: 20px;
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  .header {
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
  }
  .summary {
    margin: 20px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }
  .footer {
    margin-top: 30px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    font-size: 12px;
    color: #666;
  }
  .print-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 20px 0;
  }
  .print-button:hover {
    background-color: #45a049;
  }
  @media print {
    .print-button {
      display: none;
    }
  }
`;

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
  
  // Prepare titles
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
  
  // Create print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }
  
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
    <th>Precio</th>
  `;
  
  if (options.showCommissions) {
    tableHeaders += `<th>Comisión</th>`;
  }
  
  tableHeaders += `
    <th>Total</th>
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
      <td>${formatCurrency(totalPrice)}</td>
    `;
    
    if (options.showCommissions) {
      tableRows += `<td>${formatCurrency(commissionAmount)}</td>`;
    }
    
    tableRows += `
      <td>${formatCurrency(netTotal)}</td>
      <td>${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}</td>
    </tr>`;
  });
  
  // Summary information
  const summaryHTML = `
    <div class="summary">
      <p><strong>Total transfers:</strong> ${filteredTransfers.length}</p>
      <p><strong>Total precio:</strong> ${formatCurrency(totalPrice)}</p>
      ${options.showCommissions ? `<p><strong>Total comisiones:</strong> ${formatCurrency(totalCommissions)}</p>` : ''}
      <p><strong>Total neto:</strong> ${formatCurrency(netTotal)}</p>
    </div>
  `;
  
  // Create the HTML content
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>${getStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">${title}</div>
            ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
            <div class="subtitle">Fecha de impresión: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <table>
            <thead>
              ${tableHeaders}
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          ${summaryHTML}
          
          <button class="print-button" onclick="window.print();">Imprimir Informe</button>
          
          <div class="footer">
            Informe generado el ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}

// Function to print collaborator commission summary
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
  
  // Create print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }
  
  // Generate collaborator cards HTML
  let collaboratorCardsHTML = '';
  
  Object.values(collaboratorStats).forEach(collab => {
    // Calculate average commission
    const averageCommission = collab.transferCount > 0 
      ? collab.commissionTotal / collab.transferCount 
      : 0;
    
    collaboratorCardsHTML += `
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0; color: #333;">${collab.name}</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Transfers:</span>
          <strong>${collab.transferCount}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Comisión Total:</span>
          <strong>${formatCurrency(collab.commissionTotal)}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #eee;">
          <span>Comisión Media:</span>
          <strong>${formatCurrency(averageCommission)}</strong>
        </div>
      </div>
    `;
  });
  
  // Create the HTML content
  printWindow.document.write(`
    <html>
      <head>
        <title>Resumen de Comisiones por Colaborador</title>
        <style>${getStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">Resumen de Comisiones por Colaborador</div>
            <div class="subtitle">Fecha de impresión: ${new Date().toLocaleDateString()}</div>
          </div>
          
          ${collaboratorCardsHTML}
          
          <button class="print-button" onclick="window.print();">Imprimir Informe</button>
          
          <div class="footer">
            Informe generado el ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
