
/**
 * Shift data export utilities
 */
import { Shift, Driver } from '@/types';

// Prepare shifts data for export
export function prepareShiftsForExport(
  shifts: Shift[],
  drivers: Driver[],
  startDate: Date,
  endDate: Date
): any[] {
  // Skip if no shifts
  if (shifts.length === 0) return [];
  
  // Create a map of driver IDs to names for quick lookup
  const driverMap = drivers.reduce((map, driver) => {
    map[driver.id] = driver.name;
    return map;
  }, {} as Record<string, string>);
  
  // Filter shifts within date range
  const filteredShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startDate && shiftDate <= endDate;
  });
  
  // Transform shifts to export format
  return filteredShifts.map(shift => ({
    Fecha: shift.date,
    Conductor: driverMap[shift.driverId] || 'Desconocido',
    TipoTurno: shift.isFullDay ? 'Completo (24h)' : 'Medio (12h)',
    ID: shift.id
  }));
}
