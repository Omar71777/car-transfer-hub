
/**
 * CSV export utilities
 */

// Convert array of arrays to CSV format
export function arrayToCSV(headers: string[], rows: string[][]): string {
  const headerRow = headers.join(',');
  const csvRows = rows.map(row => {
    return row.map(value => {
      // Handle values that contain commas by wrapping them in quotes
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  });
  
  return `${headerRow}\n${csvRows.join('\n')}`;
}

// Convert data to CSV format
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      // Handle values that contain commas by wrapping them in quotes
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  });
  
  return `${headers}\n${rows.join('\n')}`;
}

// Trigger CSV download
export function downloadCSV(headers: string[], rows: string[][], filename: string): void {
  const csv = arrayToCSV(headers, rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Legacy function for compatibility
export function downloadCSVFromData(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
