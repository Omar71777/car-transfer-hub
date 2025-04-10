
import { Shift } from '@/types';
import { parseISO, isWithinInterval, isSameDay, addDays } from 'date-fns';

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
    
    if (shift.isFullDay) {
      // For 24h shifts that start at the given date
      const shiftStart = new Date(shiftDate);
      shiftStart.setHours(0, 0, 0, 0);
      
      const shiftEnd = new Date(shiftDate);
      shiftEnd.setHours(23, 59, 59, 999);
      
      if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
        return { ...getDriverDetails(shift.driverId), shiftId: shift.id };
      }
    } else {
      // For 12h shifts (assuming 10:00 to 22:00)
      const shiftStart = new Date(shiftDate);
      shiftStart.setHours(10, 0, 0, 0);
      
      const shiftEnd = new Date(shiftDate);
      shiftEnd.setHours(22, 0, 0, 0);
      
      // Check if this 12h shift contains this hour
      if (isWithinInterval(cellDateTime, { start: shiftStart, end: shiftEnd })) {
        return { ...getDriverDetails(shift.driverId), shiftId: shift.id };
      }
      
      // For night shifts (22:00 to 10:00 next day)
      const prevDay = addDays(day, -1);
      const prevDayShift = shifts.find(s => {
        const sDate = parseISO(s.date);
        return !s.isFullDay && isSameDay(sDate, prevDay);
      });
      
      if (prevDayShift) {
        const nightShiftStart = new Date(prevDay);
        nightShiftStart.setHours(22, 0, 0, 0);
        
        const nightShiftEnd = new Date(day);
        nightShiftEnd.setHours(10, 0, 0, 0);
        
        if (isWithinInterval(cellDateTime, { start: nightShiftStart, end: nightShiftEnd })) {
          return { ...getDriverDetails(prevDayShift.driverId), shiftId: prevDayShift.id };
        }
      }
    }
  }
  
  return null;
}
