
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}
