
export interface Transfer {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  price: number;
  collaborator: string;
  commission: number;
  commissionType: 'percentage' | 'fixed';
  expenses: Expense[];
  paymentStatus: 'paid' | 'pending';
  clientId: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  billed?: boolean;
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
