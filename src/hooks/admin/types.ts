
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

export interface UseUserOperationsProps {
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  editingUser: Profile | null;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsPasswordDialogOpen: (open: boolean) => void;
  setAddUserDialogOpen: (open: boolean) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setUserToDelete: (user: Profile | null) => void;
  fetchUsers: () => Promise<void>;
}
