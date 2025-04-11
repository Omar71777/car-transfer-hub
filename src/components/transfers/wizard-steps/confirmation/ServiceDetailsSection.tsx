
import React from 'react';

interface ServiceDetailsSectionProps {
  values: any;
}

export function ServiceDetailsSection({ values }: ServiceDetailsSectionProps) {
  const isPointToPoint = values.serviceType === 'transfer' || values.serviceType === 'shuttle';
  const serviceTypeLabel = 
    values.serviceType === 'transfer' ? 'Transfer' : 
    values.serviceType === 'dispo' ? 'Disposición' : 'Shuttle';

  return (
    <div>
      <h3 className="font-medium text-lg">Detalles del servicio</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <p className="text-sm text-muted-foreground">Tipo de servicio</p>
          <p>{serviceTypeLabel}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fecha y hora</p>
          <p>{values.date} {values.time}</p>
        </div>
        
        {isPointToPoint ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Origen</p>
              <p>{values.origin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destino</p>
              <p>{values.destination}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Punto de inicio</p>
              <p>{values.origin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horas contratadas</p>
              <p>{values.hours} {values.hours === 1 ? 'hora' : 'horas'}</p>
            </div>
          </>
        )}
        
        <div>
          <p className="text-sm text-muted-foreground">Estado de pago</p>
          <p>{values.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de pago'}</p>
        </div>
      </div>
    </div>
  );
}
