
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientField } from '../form-fields/client-field';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { Client } from '@/types/client';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/auth';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { PaymentStatusField } from '../form-fields/PaymentStatusField';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  serviceType: string;
  clients: Client[];
  onClientCreated: () => Promise<void>;
  isClientsLoading: boolean;
}

export const BasicInfoTab = ({
  form,
  serviceType,
  clients,
  onClientCreated,
  isClientsLoading
}: BasicInfoTabProps) => {
  const { profile, isCompanyMember } = useAuth();
  const { vehicles, loading: loadingVehicles, fetchVehicles } = useVehicles();
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  
  useEffect(() => {
    if (isCompanyMember && profile?.company_id) {
      setShowVehicleSelector(true);
      fetchVehicles(profile.company_id);
    }
  }, [isCompanyMember, profile, fetchVehicles]);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimeFields form={form} />
        <ClientField
          form={form}
          clients={clients}
          onClientCreated={onClientCreated}
          isLoading={isClientsLoading}
        />
      </div>

      {showVehicleSelector && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehículo</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loadingVehicles}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      <PaymentStatusField form={form} />
    </div>
  );
};
