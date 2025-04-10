
export interface Transfer {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  price: number;
  collaborator: string;
  commission: number;
  expenses: Expense[];
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
