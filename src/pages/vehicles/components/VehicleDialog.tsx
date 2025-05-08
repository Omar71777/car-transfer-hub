
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vehicle, VehicleType } from '@/types/vehicle';
import { Company } from '@/types/company';

const vehicleSchema = z.object({
  make: z.string().min(1, { message: 'La marca es obligatoria' }),
  model: z.string().min(1, { message: 'El modelo es obligatorio' }),
  year: z.string().regex(/^\d{4}$/, { message: 'Año inválido' }).optional().or(z.literal('')),
  license_plate: z.string().min(1, { message: 'La matrícula es obligatoria' }),
  vehicle_type: z.string().min(1, { message: 'El tipo de vehículo es obligatorio' }),
  capacity: z.string().regex(/^\d+$/, { message: 'Capacidad inválida' }).optional().or(z.literal('')),
  status: z.string().default('available'),
  company_id: z.string().optional(),
});

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  companies: Company[];
  selectedCompanyId: string | null;
  onSubmit: (data: any) => void;
}

export const VehicleDialog: React.FC<VehicleDialogProps> = ({
  open,
  onOpenChange,
  vehicle,
  companies,
  selectedCompanyId,
  onSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      license_plate: '',
      vehicle_type: 'sedan',
      capacity: '',
      status: 'available',
      company_id: selectedCompanyId || '',
    }
  });

  useEffect(() => {
    if (vehicle) {
      form.reset({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year ? vehicle.year.toString() : '',
        license_plate: vehicle.license_plate || '',
        vehicle_type: vehicle.vehicle_type || 'sedan',
        capacity: vehicle.capacity ? vehicle.capacity.toString() : '',
        status: vehicle.status || 'available',
        company_id: vehicle.company_id || selectedCompanyId || '',
      });
    } else {
      form.reset({
        make: '',
        model: '',
        year: '',
        license_plate: '',
        vehicle_type: 'sedan',
        capacity: '',
        status: 'available',
        company_id: selectedCompanyId || '',
      });
    }
  }, [vehicle, form, selectedCompanyId]);

  const handleSubmit = (data: any) => {
    // Process form data
    const processedData = {
      ...data,
      year: data.year ? parseInt(data.year) : undefined,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      company_id: data.company_id || selectedCompanyId,
    };
    
    onSubmit(processedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Vehículo' : 'Añadir Vehículo'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {companies.length > 1 && !selectedCompanyId && (
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca*</FormLabel>
                    <FormControl>
                      <Input placeholder="Marca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="license_plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula*</FormLabel>
                    <FormControl>
                      <Input placeholder="Matrícula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input placeholder="Año" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedan">Sedán</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="minibus">Minibús</SelectItem>
                        <SelectItem value="luxury">Lujo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Capacidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="in_use">En uso</SelectItem>
                      <SelectItem value="maintenance">En mantenimiento</SelectItem>
                      <SelectItem value="unavailable">No disponible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" className="w-full">
                {vehicle ? 'Actualizar' : 'Añadir'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
