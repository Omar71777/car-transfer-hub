
import { useState, useEffect, useCallback } from 'react';
import { Shift } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const { toast } = useToast();
  const { isAdmin, profile } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    fullDay: 0,
    halfDay: 0
  });

  // Update stats based on shifts
  const updateStats = useCallback((currentShifts: Shift[]) => {
    setStats({
      total: currentShifts.length,
      fullDay: currentShifts.filter(s => s.isFullDay).length,
      halfDay: currentShifts.filter(s => !s.isFullDay).length
    });
  }, []);

  // Fetch users (drivers) from Supabase
  const fetchDrivers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email');
      
      if (error) throw error;
      
      // Transform to match the driver interface
      const transformedDrivers = data.map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        email: user.email
      }));
      
      setDrivers(transformedDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los conductores',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Load data on mount
  useEffect(() => {
    // Fetch drivers from Supabase
    fetchDrivers();
    
    // Load shifts from localStorage
    const storedShifts = localStorage.getItem('shifts');
    if (storedShifts) {
      const parsedShifts = JSON.parse(storedShifts);
      setShifts(parsedShifts);
      
      // Calculate stats
      updateStats(parsedShifts);
    } else {
      setShifts([]);
      localStorage.setItem('shifts', JSON.stringify([]));
      
      // Set initial stats
      updateStats([]);
    }
  }, [fetchDrivers, updateStats]);

  // Save shifts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
    updateStats(shifts);
  }, [shifts, updateStats]);

  const handleAddShift = useCallback((shift: Omit<Shift, 'id'>) => {
    // If not admin, only allow adding shifts for self
    if (!isAdmin && profile && shift.driverId !== profile.id) {
      toast({
        title: "Acceso denegado",
        description: "Solo puedes asignar turnos a ti mismo.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if a shift already exists for that date
    const existingShift = shifts.find(s => s.date === shift.date);
    
    if (existingShift) {
      // Update existing shift if admin or own shift
      if (isAdmin || existingShift.driverId === profile?.id) {
        const updatedShifts = shifts.map(s => 
          s.date === shift.date 
            ? { ...s, driverId: shift.driverId, isFullDay: shift.isFullDay } 
            : s
        );
        setShifts(updatedShifts);
        toast({
          title: "Turno actualizado",
          description: "El turno ha sido actualizado exitosamente.",
        });
      } else {
        toast({
          title: "Acceso denegado",
          description: "No puedes modificar turnos de otros usuarios.",
          variant: "destructive"
        });
      }
    } else {
      // Create a new shift
      const newShift = {
        id: generateId(),
        ...shift
      };
      setShifts(prevShifts => [...prevShifts, newShift]);
      toast({
        title: "Turno asignado",
        description: "El turno ha sido asignado exitosamente.",
      });
    }
  }, [shifts, isAdmin, profile, toast]);

  const handleDeleteShift = useCallback((id: string) => {
    // Get the shift to check if user can delete it
    const shiftToDelete = shifts.find(s => s.id === id);
    
    if (!shiftToDelete) {
      toast({
        title: "Error",
        description: "No se encontró el turno",
        variant: "destructive"
      });
      return;
    }
    
    // If not admin, only allow deleting own shifts
    if (!isAdmin && profile && shiftToDelete.driverId !== profile.id) {
      toast({
        title: "Acceso denegado",
        description: "Solo puedes eliminar tus propios turnos.",
        variant: "destructive"
      });
      return;
    }
    
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "Turno eliminado",
      description: "El turno ha sido eliminado exitosamente.",
    });
  }, [shifts, isAdmin, profile, toast]);

  return {
    shifts,
    drivers,
    stats,
    handleAddShift,
    handleDeleteShift
  };
}
