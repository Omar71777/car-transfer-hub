import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '@/types/vehicle';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchVehicles = useCallback(async (companyId?: string) => {
    if (!user) return [];
    
    try {
      setLoading(true);
      
      // Build query based on parameters
      let query = supabase.from('vehicles').select('*');
      
      if (companyId) {
        // If company ID is provided, filter vehicles for that company
        query = query.eq('company_id', companyId);
      } else if (profile?.company_id) {
        // If user belongs to a company, show vehicles for that company
        query = query.eq('company_id', profile.company_id);
      } else {
        // Otherwise show vehicles created by this user
        query = query.eq('user_id', user.id);
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      toast.error(`Error al cargar vehículos: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const createVehicle = useCallback(async (vehicleData: CreateVehicleDto): Promise<string | null> => {
    if (!user) {
      toast.error('Debe iniciar sesión para crear un vehículo');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Vehículo creado exitosamente');
      
      // Refresh the vehicles list for this company
      fetchVehicles(vehicleData.company_id);
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      toast.error(`Error al crear vehículo: ${error.message}`);
      return null;
    }
  }, [user, fetchVehicles]);

  const updateVehicle = useCallback(async (id: string, vehicleData: UpdateVehicleDto): Promise<boolean> => {
    if (!user) {
      toast.error('Debe iniciar sesión para actualizar un vehículo');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Vehículo actualizado exitosamente');
      
      // Refresh the vehicles list
      fetchVehicles(vehicleData.company_id);
      
      return true;
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      toast.error(`Error al actualizar vehículo: ${error.message}`);
      return false;
    }
  }, [user, fetchVehicles]);

  const deleteVehicle = useCallback(async (id: string, companyId?: string): Promise<boolean> => {
    if (!user) {
      toast.error('Debe iniciar sesión para eliminar un vehículo');
      return false;
    }
    
    try {
      // Delete the vehicle
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Vehículo eliminado exitosamente');
      
      // Refresh the vehicles list
      fetchVehicles(companyId || profile?.company_id || undefined);
      
      return true;
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast.error(`Error al eliminar vehículo: ${error.message}`);
      return false;
    }
  }, [user, profile, fetchVehicles]);

  return {
    vehicles,
    loading,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
