
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { Company } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Plus, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VehiclesContentProps {
  vehicles: Vehicle[];
  companies: Company[];
  selectedCompanyId: string | null;
  onCompanyChange: (companyId: string) => void;
  loading: boolean;
  loadingCompanies: boolean;
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehiclesContent: React.FC<VehiclesContentProps> = ({
  vehicles,
  companies,
  selectedCompanyId,
  onCompanyChange,
  loading,
  loadingCompanies,
  onAdd,
  onEdit,
  onDelete
}) => {
  if (loading && loadingCompanies) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-primary">Vehículos</h1>
          <p className="text-muted-foreground">Gestione los vehículos de su flota</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {companies.length > 1 && (
            <Select
              value={selectedCompanyId || ""}
              onValueChange={onCompanyChange}
              disabled={loadingCompanies}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={onAdd} className="mobile-btn">
            <Plus className="w-4 h-4 mr-2" /> Añadir Vehículo
          </Button>
        </div>
      </div>

      {!selectedCompanyId && companies.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No hay empresas</h3>
              <p className="text-muted-foreground mb-4">Primero necesita crear una empresa para agregar vehículos.</p>
              <Button onClick={onAdd} disabled>
                <Plus className="w-4 h-4 mr-2" /> Añadir Vehículo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : vehicles.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No hay vehículos</h3>
              <p className="text-muted-foreground mb-4">Para comenzar, agregue un vehículo usando el botón de arriba.</p>
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" /> Añadir Vehículo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onEdit={() => onEdit(vehicle)}
              onDelete={() => onDelete(vehicle)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const getVehicleTypeLabel = (type: string) => {
    const types = {
      'sedan': 'Sedán',
      'suv': 'SUV',
      'van': 'Van',
      'bus': 'Bus',
      'minibus': 'Minibús',
      'luxury': 'Lujo'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'in_use':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
          <Badge variant="outline">{getVehicleTypeLabel(vehicle.vehicle_type)}</Badge>
        </div>
        <CardDescription>{vehicle.license_plate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)} mr-2`}></div>
          <span className="text-sm capitalize">{vehicle.status}</span>
        </div>
        {vehicle.year && <p className="text-sm">Año: {vehicle.year}</p>}
        {vehicle.capacity && <p className="text-sm">Capacidad: {vehicle.capacity} personas</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};
