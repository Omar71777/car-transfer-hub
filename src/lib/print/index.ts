
/**
 * Print utilities and helpers for the application
 */

/**
 * Adds print-specific stylesheets to the document head
 */
export function addPrintStyles(): void {
  const id = 'print-styles';
  
  // Remove existing print styles if any
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  // Create and append print stylesheet
  const style = document.createElement('style');
  style.id = id;
  style.media = 'print';
  style.innerHTML = `
    @page {
      size: A4;
      margin: 10mm;
    }
    
    body {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      background-color: white;
      color: black;
      font-size: 12pt;
    }
    
    .print-content {
      width: 190mm;
      margin: 0 auto;
      padding: 10mm 0;
      box-sizing: border-box;
    }
    
    .no-print,
    button,
    [role="button"],
    [role="navigation"],
    nav,
    footer,
    .print-actions,
    .hidden-print {
      display: none !important;
    }
    
    /* Ensure tables don't break across pages inappropriately */
    table {
      page-break-inside: avoid;
    }
    
    table.allow-break {
      page-break-inside: auto;
    }
    
    table.allow-break thead {
      display: table-header-group;
    }
    
    table.allow-break tfoot {
      display: table-footer-group;
    }
    
    table.allow-break tr {
      page-break-inside: avoid;
    }
    
    /* Keep certain elements together */
    .keep-together {
      page-break-inside: avoid;
    }
    
    /* Force page breaks when needed */
    .page-break-before {
      page-break-before: always;
    }
    
    .page-break-after {
      page-break-after: always;
    }
    
    /* Ensure black text on white background */
    * {
      color: black !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
    
    /* Expand all collapsed sections for printing */
    details {
      display: block !important;
    }
    
    details > summary {
      display: none !important;
    }
    
    details > div {
      display: block !important;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Prints the current document with the appropriate styles
 */
export function printDocument(): void {
  addPrintStyles();
  window.print();
}

/**
 * Prints a specific element with the appropriate styles
 */
export function printElement(element: HTMLElement | null): void {
  if (!element) return;
  
  // Create a clone of the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return;
  }
  
  // Create the print document
  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            background-color: white;
            color: black;
            font-size: 12pt;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .print-content {
            width: 190mm;
            margin: 0 auto;
            padding: 10mm 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            padding: 0.25rem 0.5rem;
            border: 1px solid #ddd;
            text-align: left;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          
          .keep-together {
            page-break-inside: avoid;
          }
          
          .page-break-before {
            page-break-before: always;
          }
          
          .no-print, button {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="print-content"></div>
        <script>
          window.onload = function() {
            setTimeout(() => window.print(), 200);
          };
        </script>
      </body>
    </html>
  `);
  
  // Append the clone to the print window
  const printContent = printWindow.document.querySelector('.print-content');
  if (printContent) {
    printContent.appendChild(clone);
  }
  
  printWindow.document.close();
}
