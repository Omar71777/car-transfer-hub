
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@/types/company';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchCompanies = useCallback(async () => {
    if (!user) return [];
    
    try {
      setLoading(true);
      
      // Fetch companies based on user role/type
      let query = supabase.from('companies').select('*');
      
      if (profile?.role !== 'admin') {
        // For non-admin users, only show companies they belong to or created
        query = query.eq('user_id', user.id);
        
        if (profile?.company_id) {
          // If user belongs to a company but didn't create it, include that too
          query = supabase.from('companies')
            .select('*')
            .or(`user_id.eq.${user.id},id.eq.${profile.company_id}`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setCompanies(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error(`Error al cargar empresas: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const createCompany = useCallback(async (companyData: CreateCompanyDto): Promise<string | null> => {
    if (!user) {
      toast.error('Debe iniciar sesión para crear una empresa');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Empresa creada exitosamente');
      
      // Refresh the companies list
      fetchCompanies();
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(`Error al crear empresa: ${error.message}`);
      return null;
    }
  }, [user, fetchCompanies]);

  const updateCompany = useCallback(async (id: string, companyData: UpdateCompanyDto): Promise<boolean> => {
    if (!user) {
      toast.error('Debe iniciar sesión para actualizar una empresa');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Empresa actualizada exitosamente');
      
      // Refresh the companies list
      fetchCompanies();
      
      return true;
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error(`Error al actualizar empresa: ${error.message}`);
      return false;
    }
  }, [user, fetchCompanies]);

  const deleteCompany = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Debe iniciar sesión para eliminar una empresa');
      return false;
    }
    
    try {
      // Check if the user is allowed to delete this company
      const { data, error: checkError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (checkError || !data) {
        toast.error('No tiene permisos para eliminar esta empresa');
        return false;
      }
      
      // Delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Empresa eliminada exitosamente');
      
      // Refresh the companies list
      fetchCompanies();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(`Error al eliminar empresa: ${error.message}`);
      return false;
    }
  }, [user, fetchCompanies]);

  return {
    companies,
    loading,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany
  };
}
