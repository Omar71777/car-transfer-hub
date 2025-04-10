
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type UserFormValues = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type PasswordFormValues = {
  password: string;
};
