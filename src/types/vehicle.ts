
export type VehicleType = 'sedan' | 'suv' | 'van' | 'bus' | 'minibus' | 'luxury';

export interface Vehicle {
  id: string;
  company_id: string;
  make: string;
  model: string;
  year?: number;
  license_plate: string;
  vehicle_type: VehicleType;
  capacity?: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateVehicleDto {
  company_id: string;
  make: string;
  model: string;
  year?: number;
  license_plate: string;
  vehicle_type: VehicleType;
  capacity?: number;
  status?: string;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}
