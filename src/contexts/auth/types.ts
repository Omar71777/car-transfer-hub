
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
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
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<boolean>;
};
