
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

export function useFetchUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Use the service role to bypass RLS for admin operations
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    setUsers,
    loading,
    fetchUsers
  };
}
