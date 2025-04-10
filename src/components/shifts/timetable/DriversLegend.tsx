
import React, { memo } from 'react';
import { Driver } from '@/types';
import { GripHorizontal, FilterIcon, Clock12, Clock, Calendar } from 'lucide-react';
import { getShiftColorVar } from './ShiftUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DriversLegendProps {
  drivers: Driver[];
  driverColors: Record<string, string>;
}

function DriversLegendComponent({ drivers, driverColors }: DriversLegendProps) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-3 mb-2">
        {drivers.map(driver => (
          <TooltipProvider key={driver.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center hover:bg-muted/50 p-1 px-2 rounded-full transition-colors cursor-default">
                  <div className={`w-3 h-3 rounded-full ${driverColors[driver.id] || 'bg-gray-500'}`} />
                  <span className="text-xs ml-1">{driver.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Conductor: {driver.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center bg-muted/30 p-1 px-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${getShiftColorVar('half')}`} />
          <Clock12 className="h-3 w-3 mx-1 text-blue-500" />
          <span className="text-xs">Turno 12h</span>
        </div>
        <div className="flex items-center bg-muted/30 p-1 px-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${getShiftColorVar('full')}`} />
          <Clock className="h-3 w-3 mx-1 text-purple-500" />
          <span className="text-xs">Turno 24h</span>
        </div>
        <div className="flex items-center bg-muted/30 p-1 px-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${getShiftColorVar('free')}`} />
          <Calendar className="h-3 w-3 mx-1 text-green-500" />
          <span className="text-xs">Día libre</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-2">
        <div className="flex items-center">
          <GripHorizontal className="h-3 w-3 mr-1" />
          <span>Arrastra para seleccionar varios turnos a la vez</span>
        </div>
        
        <div className="flex items-center">
          <FilterIcon className="h-3 w-3 mr-1" />
          <span>Usa los filtros para visualizar turnos específicos</span>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to avoid unnecessary re-renders
export const DriversLegend = memo(DriversLegendComponent);
