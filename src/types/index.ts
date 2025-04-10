
export interface Transfer {
  id: string;
  date: string;
  time: string;
  serviceType: 'transfer' | 'dispo';
  origin: string;
  destination?: string;
  hours?: string;
  price: number;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  collaborator: string;
  commission: number;
  commissionType: 'percentage' | 'fixed';
  expenses: Expense[];
  extraCharges: ExtraCharge[];
  paymentStatus: 'paid' | 'pending';
  clientId: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  billed?: boolean;
}

export interface ExtraCharge {
  id: string;
  transferId: string;
  name: string;
  price: number;
}

export interface Expense {
  id: string;
  transferId: string;
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
}
