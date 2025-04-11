
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export type Collaborator = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch collaborators from Supabase
  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setCollaborators([]);
        return;
      }

      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      // Transform data to match our Collaborator type
      const formattedCollaborators: Collaborator[] = data.map(item => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email
      }));

      setCollaborators(formattedCollaborators);
    } catch (error) {
      console.error('Error loading collaborators:', error);
      toast.error('Error al cargar colaboradores');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new collaborator to Supabase
  const addCollaborator = useCallback(async (collaborator: Omit<Collaborator, 'id'>) => {
    try {
      if (!user) {
        toast.error('Usuario no autenticado');
        return false;
      }
      
      const { data, error } = await supabase
        .from('collaborators')
        .insert({
          name: collaborator.name,
          phone: collaborator.phone,
          email: collaborator.email,
          user_id: user.id
        })
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add the new collaborator to the local state
      const newCollaborator: Collaborator = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      toast.success('Colaborador añadido con éxito');
      return true;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      toast.error('Error al añadir colaborador');
      return false;
    }
  }, [user]);

  // Update an existing collaborator in Supabase
  const updateCollaborator = useCallback(async (id: string, collaborator: Partial<Collaborator>) => {
    try {
      if (!user) {
        toast.error('Usuario no autenticado');
        return false;
      }
      
      const { error } = await supabase
        .from('collaborators')
        .update({
          name: collaborator.name,
          phone: collaborator.phone,
          email: collaborator.email,
          updated_at: new Date()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the collaborator in the local state
      setCollaborators(prev => 
        prev.map(c => c.id === id ? { ...c, ...collaborator } : c)
      );
      
      toast.success('Colaborador actualizado con éxito');
      return true;
    } catch (error) {
      console.error('Error updating collaborator:', error);
      toast.error('Error al actualizar colaborador');
      return false;
    }
  }, [user]);

  // Delete a collaborator from Supabase
  const deleteCollaborator = useCallback(async (id: string) => {
    try {
      if (!user) {
        toast.error('Usuario no autenticado');
        return false;
      }
      
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Remove the collaborator from the local state
      setCollaborators(prev => prev.filter(c => c.id !== id));
      toast.success('Colaborador eliminado con éxito');
      return true;
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      toast.error('Error al eliminar colaborador');
      return false;
    }
  }, [user]);

  // Load collaborators on mount
  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  return {
    collaborators,
    loading,
    fetchCollaborators,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator
  };
}
