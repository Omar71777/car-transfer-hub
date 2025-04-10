
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

export interface Driver {
  id: string;
  name: string;
  email: string;
}

export interface Shift {
  id: string;
  date: string;
  driverId: string;
  isFullDay: boolean; // true para 24h, false para 12h
  isFreeDay?: boolean; // true para día libre
}

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
}
