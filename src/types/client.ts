
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string; // Changed from taxId to match database column
  notes?: string;
  created_at: string; // Changed from createdAt to match database column
  updated_at: string; // Changed from updatedAt to match database column
  user_id: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string; // Changed from taxId
  notes?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}
