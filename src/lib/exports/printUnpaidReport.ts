
/**
 * Print utilities for unpaid transfers report generation
 */
import { format } from 'date-fns';

// Print function for unpaid transfers
export function printUnpaidReport(
  title: string,
  monthlyData: {
    collaborator: string;
    month: string;
    transferCount: number;
    total: number;
    transfers: any[];
  }[],
  userData?: { 
    name: string;
    email: string;
  }
): void {
  // Get current date
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  
  // Calculate grand total
  const grandTotal = monthlyData.reduce((sum, data) => sum + data.total, 0);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to print reports');
    return;
  }
  
  // Generate report HTML
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; }
          h2 { color: #555; margin-top: 20px; }
          .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .user-info { margin-bottom: 15px; color: #666; }
          .date-info { text-align: right; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
          th { background-color: #f2f2f2; padding: 10px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .summary { font-weight: bold; background-color: #f9f9f9; }
          .right { text-align: right; }
          .collaborator-section { margin-bottom: 30px; page-break-inside: avoid; }
          .grand-total { font-size: 1.2em; margin-top: 30px; text-align: right; font-weight: bold; }
          @media print {
            button { display: none; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        
        <div class="header-info">
          ${userData ? `<div class="user-info">Usuario: ${userData.name || userData.email}</div>` : ''}
          <div class="date-info">Fecha del informe: ${currentDate}</div>
        </div>
        
        <h2>Resumen de Pagos Pendientes por Mes y Colaborador</h2>
        <table>
          <tr>
            <th>Colaborador</th>
            <th>Mes</th>
            <th class="right">Nº Transfers</th>
            <th class="right">Total a Pagar</th>
          </tr>
          ${monthlyData.map(data => `
            <tr>
              <td>${data.collaborator}</td>
              <td>${data.month}</td>
              <td class="right">${data.transferCount}</td>
              <td class="right">${data.total.toFixed(2)}€</td>
            </tr>
          `).join('')}
          <tr class="summary">
            <td colspan="3" class="right">Total general:</td>
            <td class="right">${grandTotal.toFixed(2)}€</td>
          </tr>
        </table>
  `);
  
  // Generate detailed sections for each collaborator
  const collaboratorGroups = monthlyData.reduce((groups, item) => {
    if (!groups[item.collaborator]) {
      groups[item.collaborator] = [];
    }
    groups[item.collaborator].push(item);
    return groups;
  }, {} as Record<string, typeof monthlyData>);
  
  // Add detailed transfers for each collaborator, with page breaks
  printWindow.document.write(`
    <div class="page-break"></div>
    <h2>Detalle de Transfers Pendientes por Colaborador</h2>
  `);
  
  Object.entries(collaboratorGroups).forEach(([collaborator, data], index) => {
    if (index > 0) {
      printWindow.document.write(`<div class="page-break"></div>`);
    }
    
    printWindow.document.write(`
      <div class="collaborator-section">
        <h3>Colaborador: ${collaborator}</h3>
    `);
    
    data.forEach(monthData => {
      const collaboratorTotal = monthData.total;
      
      printWindow.document.write(`
        <h4>Mes: ${monthData.month}</h4>
        <table>
          <tr>
            <th>Fecha</th>
            <th>Origen</th>
            <th>Destino</th>
            <th class="right">Precio</th>
            <th class="right">Comisión</th>
            <th class="right">Importe</th>
          </tr>
      `);
      
      monthData.transfers.forEach(transfer => {
        const commissionAmount = (transfer.price * transfer.commission) / 100;
        const amountToPay = transfer.price - commissionAmount;
        
        printWindow.document.write(`
          <tr>
            <td>${transfer.date}</td>
            <td>${transfer.origin}</td>
            <td>${transfer.destination}</td>
            <td class="right">${transfer.price.toFixed(2)}€</td>
            <td class="right">${transfer.commission}%</td>
            <td class="right">${amountToPay.toFixed(2)}€</td>
          </tr>
        `);
      });
      
      printWindow.document.write(`
          <tr class="summary">
            <td colspan="5" class="right">Total ${monthData.month}:</td>
            <td class="right">${collaboratorTotal.toFixed(2)}€</td>
          </tr>
        </table>
      `);
    });
    
    // Calculate total for this collaborator
    const collaboratorGrandTotal = data.reduce((sum, monthData) => sum + monthData.total, 0);
    
    printWindow.document.write(`
        <div class="grand-total">
          Total a cobrar de ${collaborator}: ${collaboratorGrandTotal.toFixed(2)}€
        </div>
      </div>
    `);
  });
  
  printWindow.document.write(`
        <button onclick="window.print();" style="margin-top: 20px; padding: 10px 20px;">
          Imprimir Informe
        </button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
