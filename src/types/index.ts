
export interface Transfer {
  id: string;
  date: string;
  time: string;
  serviceType: 'transfer' | 'dispo';
  origin: string;
  destination?: string;
  hours?: number | string;  // Can accept either number or string
  price: number;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  collaborator: string;
  commission: number;
  commissionType: 'percentage' | 'fixed';
  expenses: Expense[];
  extraCharges: ExtraCharge[];
  paymentStatus: 'paid' | 'pending';
  payment_method?: 'card' | 'cash' | 'bank_transfer' | null;
  clientId: string;
  client?: Client;
  billed?: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ExtraCharge {
  id: string;
  transferId: string;
  name: string;
  price: string | number;  // Can accept either string or number
}

export interface Expense {
  id: string;
  transferId: string;  // Camel case format
  date: string;
  concept: string;
  amount: number;
}

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  company_name: string | null;
  company_address: string | null;
  company_tax_id: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_logo: string | null;
}
