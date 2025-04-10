
import React from 'react';
import { Driver } from '@/types';
import { GripHorizontal, FilterIcon } from 'lucide-react';

interface DriversLegendProps {
  drivers: Driver[];
  driverColors: Record<string, string>;
}

export function DriversLegend({ drivers, driverColors }: DriversLegendProps) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-3 mb-2">
        {drivers.map(driver => (
          <div key={driver.id} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${driverColors[driver.id] || 'bg-gray-500'}`} />
            <span className="text-xs ml-1">{driver.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center">
          <GripHorizontal className="h-3 w-3 mr-1" />
          <span>Consejo: Arrastra para seleccionar varios turnos a la vez</span>
        </div>
        
        <div className="flex items-center">
          <FilterIcon className="h-3 w-3 mr-1" />
          <span>Usa los filtros para visualizar turnos específicos</span>
        </div>
      </div>
    </div>
  );
}
