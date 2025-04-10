
import { Shift } from '@/types';
import { parseISO, isWithinInterval, isSameDay, addDays, addHours } from 'date-fns';

// Function to calculate shift coverage for a specific hour on a specific day
export function getShiftForTimeSlot(
  day: Date, 
  hour: number, 
  shifts: Shift[], 
  getDriverDetails: (driverId: string) => { name: string; color: string }
) {
  const cellDateTime = new Date(day);
  cellDateTime.setHours(hour, 0, 0, 0);
  
  // Check which shift covers this time slot
  for (const shift of shifts) {
    const shiftDate = parseISO(shift.date);
    const shiftHour = shift.startHour || 0; // Default to 0 if not specified
    
    // Create shift start time by combining date and hour
    const shiftStart = new Date(shiftDate);
    shiftStart.setHours(shiftHour, 0, 0, 0);
    
    let shiftEnd;
    
    if (shift.isFullDay) {
      // For full day shifts (24h), the end is 24 hours after start
      shiftEnd = addHours(shiftStart, 24);
    } else if (shift.isFreeDay) {
      // Free days are also 24 hours
      shiftEnd = addHours(shiftStart, 24);
    } else {
      // For 12h shifts
      shiftEnd = addHours(shiftStart, 12);
    }
    
    // Check if this cell's time is within the shift period
    if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
      return { 
        ...getDriverDetails(shift.driverId), 
        shiftId: shift.id,
        type: shift.isFreeDay ? 'free' : (shift.isFullDay ? 'full' : 'half')
      };
    }
  }
  
  return null;
}

// Function to determine style for shift based on its type
export function getShiftStyle(shift: Shift) {
  if (shift.isFreeDay) {
    return 'free-day'; // CSS class for free days
  } else if (shift.isFullDay) {
    return 'full-day'; // CSS class for 24h shifts
  } else {
    return 'half-day'; // CSS class for 12h shifts
  }
}
