
export type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
  user_subtype: string | null;
  company_id: string | null;
  company_name: string | null;
  company_address: string | null;
  company_tax_id: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_logo: string | null;
  created_at: string;
  updated_at: string;
};

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

export interface UseToggleUserRoleProps {
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
}

export interface UseUpdateUserProps {
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  editingUser: Profile | null;
  setIsEditDialogOpen: (open: boolean) => void;
}

export interface UseResetPasswordProps {
  editingUser: Profile | null;
  setIsPasswordDialogOpen: (open: boolean) => void;
}

export interface UseCreateUserProps {
  fetchUsers: () => Promise<void>;
  setAddUserDialogOpen: (open: boolean) => void;
}

export interface UseDeleteUserProps {
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  setDeleteConfirmOpen: (open: boolean) => void;
  setUserToDelete: (user: Profile | null) => void;
}
