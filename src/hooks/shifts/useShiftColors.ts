
import { useMemo, useCallback } from 'react';
import { Driver } from '@/types';

export function useShiftColors(drivers: Driver[]) {
  // Create a color map for drivers
  const driverColors = useMemo(() => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500',
      'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500'
    ];
    
    return drivers.reduce((acc, driver, index) => {
      acc[driver.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [drivers]);

  // Helper to get driver details
  const getDriverDetails = useCallback((driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return {
      name: driver ? driver.name : 'Desconocido',
      color: driverColors[driverId] || 'bg-gray-500'
    };
  }, [drivers, driverColors]);

  return {
    driverColors,
    getDriverDetails
  };
}
