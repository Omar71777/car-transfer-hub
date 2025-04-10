
/**
 * Utility functions for exporting shift data
 */

// Prepare shifts data for export to CSV format
export const prepareShiftsForExport = (shifts: any[]) => {
  if (!shifts || shifts.length === 0) {
    return [];
  }

  return shifts.map(shift => ({
    'ID': shift.id,
    'Conductor': shift.driverName || 'No asignado',
    'Fecha': shift.date,
    'Hora Inicio': shift.startTime,
    'Hora Fin': shift.endTime,
    'Notas': shift.notes || ''
  }));
};
