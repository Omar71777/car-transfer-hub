
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

// Default collaborators to populate if none exist
const defaultCollaborators: Omit<Collaborator, 'id'>[] = [
  { name: 'Juan Pérez', phone: '612345678', email: 'juan@example.com' },
  { name: 'María García', phone: '623456789', email: 'maria@example.com' },
  { name: 'Carlos Rodríguez', phone: '634567890', email: 'carlos@example.com' }
];

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load collaborators from Supabase or localStorage as fallback
  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get from localStorage first as fallback
      const stored = localStorage.getItem('collaborators');
      let storedCollaborators = stored ? JSON.parse(stored) : [];
      
      // If no collaborators exist yet, add default ones
      if (storedCollaborators.length === 0) {
        storedCollaborators = defaultCollaborators.map(collaborator => ({
          ...collaborator,
          id: crypto.randomUUID()
        }));
        localStorage.setItem('collaborators', JSON.stringify(storedCollaborators));
      }
      
      if (user) {
        // If user is logged in, try to get from Supabase in future implementation
        // For now, we're still using localStorage as the source
        setCollaborators(storedCollaborators);
      } else {
        // Fallback to localStorage if not logged in
        setCollaborators(storedCollaborators);
      }
    } catch (error) {
      console.error('Error loading collaborators:', error);
      toast.error('Error al cargar colaboradores');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save collaborators to localStorage
  const saveCollaborators = useCallback((updatedCollaborators: Collaborator[]) => {
    try {
      localStorage.setItem('collaborators', JSON.stringify(updatedCollaborators));
    } catch (error) {
      console.error('Error saving collaborators:', error);
      toast.error('Error al guardar colaboradores');
    }
  }, []);

  // Add a new collaborator
  const addCollaborator = useCallback((collaborator: Omit<Collaborator, 'id'>) => {
    try {
      const newCollaborator = {
        ...collaborator,
        id: crypto.randomUUID()
      };
      
      const updatedCollaborators = [...collaborators, newCollaborator];
      setCollaborators(updatedCollaborators);
      saveCollaborators(updatedCollaborators);
      toast.success('Colaborador añadido con éxito');
      return true;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      toast.error('Error al añadir colaborador');
      return false;
    }
  }, [collaborators, saveCollaborators]);

  // Update an existing collaborator
  const updateCollaborator = useCallback((id: string, collaborator: Partial<Collaborator>) => {
    try {
      const updatedCollaborators = collaborators.map(c => 
        c.id === id ? { ...c, ...collaborator } : c
      );
      
      setCollaborators(updatedCollaborators);
      saveCollaborators(updatedCollaborators);
      toast.success('Colaborador actualizado con éxito');
      return true;
    } catch (error) {
      console.error('Error updating collaborator:', error);
      toast.error('Error al actualizar colaborador');
      return false;
    }
  }, [collaborators, saveCollaborators]);

  // Delete a collaborator
  const deleteCollaborator = useCallback((id: string) => {
    try {
      const updatedCollaborators = collaborators.filter(c => c.id !== id);
      setCollaborators(updatedCollaborators);
      saveCollaborators(updatedCollaborators);
      toast.success('Colaborador eliminado con éxito');
      return true;
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      toast.error('Error al eliminar colaborador');
      return false;
    }
  }, [collaborators, saveCollaborators]);

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
