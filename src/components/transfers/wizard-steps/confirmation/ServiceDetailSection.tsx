
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceDetailSectionProps {
  values: any;
}

export function ServiceDetailSection({ values }: ServiceDetailSectionProps) {
  const isMobile = useIsMobile();
  
  // Format date
  const formattedDate = values.date 
    ? format(new Date(values.date), 'dd MMMM yyyy', { locale: es })
    : 'Fecha no especificada';
  
  return (
    <div>
      <h3 className="font-medium text-lg">Detalles del servicio</h3>
      <div className={isMobile ? "grid grid-cols-1 gap-2 mt-2" : "grid grid-cols-2 gap-2 mt-2"}>
        <div>
          <p className="text-sm text-muted-foreground">Tipo de servicio</p>
          <p>{values.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fecha</p>
          <p>{formattedDate}</p>
        </div>
        
        {values.time && (
          <div>
            <p className="text-sm text-muted-foreground">Hora</p>
            <p>{values.time}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground">
            {values.serviceType === 'transfer' ? 'Origen' : 'Punto de inicio'}
          </p>
          <p className="truncate">{values.origin}</p>
        </div>
        
        {values.serviceType === 'transfer' && (
          <div>
            <p className="text-sm text-muted-foreground">Destino</p>
            <p className="truncate">{values.destination}</p>
          </div>
        )}
        
        {values.serviceType === 'dispo' && (
          <div>
            <p className="text-sm text-muted-foreground">Horas contratadas</p>
            <p>{values.hours} horas</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground">Estado de pago</p>
          <p className={values.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
            {values.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de pago'}
          </p>
        </div>
      </div>
    </div>
  );
}
