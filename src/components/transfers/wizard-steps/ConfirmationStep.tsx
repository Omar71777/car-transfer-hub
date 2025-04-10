
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ConfirmationStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ConfirmationStep({ clients, collaborators, formState }: ConfirmationStepProps) {
  const { getValues } = useFormContext();
  const values = getValues();
  
  const client = clients?.find(c => c.id === values.clientId);
  const extraCharges = values.extraCharges || [];
  const validExtraCharges = extraCharges.filter((charge: any) => 
    charge.name && charge.price && charge.name.trim() !== '' && Number(charge.price) > 0
  );
  
  // Calculate total for extra charges
  const totalExtraCharges = validExtraCharges.reduce((sum: number, charge: any) => {
    return sum + (Number(charge.price) || 0);
  }, 0);
  
  // Calculate base price (considering service type)
  const basePrice = values.serviceType === 'dispo'
    ? Number(values.price) * Number(values.hours || 1)
    : Number(values.price);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (values.discountType && values.discountValue) {
    if (values.discountType === 'percentage') {
      discountAmount = basePrice * (Number(values.discountValue) / 100);
    } else {
      discountAmount = Number(values.discountValue);
    }
  }
  
  // Calculate total price
  const totalPrice = basePrice + totalExtraCharges - discountAmount;
  
  // Calculate commission amount in euros
  let commissionAmountEuros = 0;
  if (values.collaborator && values.collaborator !== 'none' && values.commission) {
    if (values.commissionType === 'percentage') {
      commissionAmountEuros = totalPrice * (Number(values.commission) / 100);
    } else {
      commissionAmountEuros = Number(values.commission);
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold">Confirma los detalles del servicio</h2>
        <p className="text-muted-foreground mt-1">
          Revisa toda la información antes de completar
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-medium text-lg">Información del cliente</h3>
              <p>{client?.name}</p>
              <p className="text-sm text-muted-foreground">{client?.email}</p>
            </div>

            <div>
              <h3 className="font-medium text-lg">Detalles del servicio</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de servicio</p>
                  <p>{values.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha y hora</p>
                  <p>{values.date} {values.time}</p>
                </div>
                
                {values.serviceType === 'transfer' ? (
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
                      <p>{values.hours} horas</p>
                    </div>
                  </>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Estado de pago</p>
                  <p>{values.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de pago'}</p>
                </div>
              </div>
            </div>

            {values.collaborator && values.collaborator !== 'none' && (
              <div>
                <h3 className="font-medium text-lg">Información del colaborador</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre del colaborador</p>
                    <p>{values.collaborator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comisión</p>
                    <p>
                      {values.commission} {values.commissionType === 'percentage' ? '%' : '€'}
                      {values.commissionType === 'percentage' && (
                        <span className="ml-1 text-sm text-muted-foreground">
                          ({formatCurrency(commissionAmountEuros)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium text-lg">Detalles del precio</h3>
              <div className="space-y-2 mt-2">
                {values.serviceType === 'dispo' ? (
                  <div className="flex justify-between">
                    <p className="text-sm">Precio base ({values.price}€ × {values.hours} horas)</p>
                    <p>{formatCurrency(basePrice)}</p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <p className="text-sm">Precio base</p>
                    <p>{formatCurrency(basePrice)}</p>
                  </div>
                )}
                
                {validExtraCharges.length > 0 && (
                  <>
                    {validExtraCharges.map((charge: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <p className="text-sm">{charge.name}</p>
                        <p>{formatCurrency(Number(charge.price) || 0)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-1">
                      <p className="text-sm">Subtotal cargos extra</p>
                      <p>{formatCurrency(totalExtraCharges)}</p>
                    </div>
                  </>
                )}
                
                {values.discountType && values.discountValue && (
                  <div className="flex justify-between text-green-600">
                    <p className="text-sm">Descuento {values.discountType === 'percentage' ? `(${values.discountValue}%)` : ''}</p>
                    <p>-{formatCurrency(discountAmount)}</p>
                  </div>
                )}
                
                <div className="flex justify-between font-bold pt-2 border-t">
                  <p>TOTAL</p>
                  <p>{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
