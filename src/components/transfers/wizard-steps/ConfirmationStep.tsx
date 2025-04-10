
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CalendarIcon, MapPin, User, DollarSign, Users } from 'lucide-react';

interface ConfirmationStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ConfirmationStep({ clients, collaborators, formState }: ConfirmationStepProps) {
  const { getValues } = useFormContext();
  const values = getValues();
  
  // Get client name
  const getClientName = () => {
    if (values.clientId === 'new') {
      return values.clientName;
    }
    
    const client = clients.find(c => c.id === values.clientId);
    return client ? client.name : 'Cliente desconocido';
  };
  
  // Format price and commission
  const formatPrice = (price: string | number) => {
    return `${Number(price).toFixed(2)}€`;
  };
  
  const formatCommission = () => {
    if (!values.commission) return 'Sin comisión';
    
    if (values.commissionType === 'percentage') {
      return `${values.commission}% (${((Number(values.price) * Number(values.commission)) / 100).toFixed(2)}€)`;
    } else {
      return `${Number(values.commission).toFixed(2)}€ (${(Number(values.commission) / Number(values.price) * 100).toFixed(1)}%)`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Check className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Confirma la información del transfer</h2>
        <p className="text-muted-foreground mt-1">
          Revisa los detalles antes de crear el transfer
        </p>
      </div>

      <div className="space-y-4 max-w-full">
        <Card className="p-4 space-y-3 overflow-hidden">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <h3 className="font-medium">Cliente</h3>
              <p className="truncate">{getClientName()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Fecha y Hora</h3>
              <p>
                {new Date(values.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                {values.time && ` a las ${values.time}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="max-w-full">
              <h3 className="font-medium">Ruta</h3>
              <p className="break-words">Desde: {values.origin}</p>
              <p className="break-words">Hasta: {values.destination}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Precio</h3>
              <p>{formatPrice(values.price)}</p>
              <div className="mt-1">
                <Badge variant={values.paymentStatus === 'paid' ? 'default' : 'outline'}>
                  {values.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de Pago'}
                </Badge>
              </div>
            </div>
          </div>
          
          {values.collaborator && values.collaborator !== 'none' && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Colaborador</h3>
                <p>{values.collaborator}</p>
                <p className="text-sm text-muted-foreground">Comisión: {formatCommission()}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
