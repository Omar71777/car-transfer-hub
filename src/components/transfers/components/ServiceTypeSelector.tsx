
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Clock } from 'lucide-react';

interface ServiceTypeSelectorProps {
  activeTab: 'transfer' | 'dispo';
  onTabChange: (value: string) => void;
}

export function ServiceTypeSelector({ activeTab, onTabChange }: ServiceTypeSelectorProps) {
  return (
    <>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="transfer" className="flex items-center">
            <Car className="h-4 w-4 mr-2" />
            <span>Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="dispo" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Disposición</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {activeTab === 'transfer' 
            ? 'Servicio de Transfer (punto a punto)' 
            : 'Servicio de Disposición (por horas)'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {activeTab === 'transfer' 
            ? 'Complete los detalles del traslado de un punto a otro' 
            : 'Complete los detalles del servicio por horas'}
        </p>
      </div>
    </>
  );
}
