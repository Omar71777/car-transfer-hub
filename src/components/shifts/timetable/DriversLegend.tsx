
import React from 'react';
import { Driver } from '@/types';

interface DriversLegendProps {
  drivers: Driver[];
  driverColors: Record<string, string>;
}

export function DriversLegend({ drivers, driverColors }: DriversLegendProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {drivers.map(driver => (
        <div key={driver.id} className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${driverColors[driver.id] || 'bg-gray-500'}`} />
          <span className="text-xs ml-1">{driver.name}</span>
        </div>
      ))}
    </div>
  );
}
