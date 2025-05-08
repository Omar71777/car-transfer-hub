
export interface Company {
  id: string;
  name: string;
  address?: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateCompanyDto {
  name: string;
  address?: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}
