
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type Collaborator = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  // Load collaborators from localStorage
  const fetchCollaborators = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('collaborators');
      // Default collaborators if none exist
      const defaultCollaborators: Collaborator[] = [
        { id: '1', name: 'Carlos Sánchez', phone: '666111222', email: 'carlos@example.com' },
        { id: '2', name: 'María López', phone: '666333444', email: 'maria@example.com' },
        { id: '3', name: 'Juan Rodríguez', phone: '666555666', email: 'juan@example.com' },
      ];
      
      const loadedCollaborators = stored ? JSON.parse(stored) : defaultCollaborators;
      setCollaborators(loadedCollaborators);
    } catch (error) {
      console.error('Error loading collaborators:', error);
      toast.error('Error al cargar colaboradores');
    } finally {
      setLoading(false);
    }
  }, []);

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
