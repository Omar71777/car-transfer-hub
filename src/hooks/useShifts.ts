
import { useState, useEffect, useCallback } from 'react';
import { Shift } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
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

  const updateStats = useCallback((currentShifts: Shift[]) => {
    setStats({
      total: currentShifts.length,
      fullDay: currentShifts.filter(s => s.isFullDay && !s.isFreeDay).length,
      halfDay: currentShifts.filter(s => !s.isFullDay).length
    });
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email');
      
      if (error) throw error;
      
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

  useEffect(() => {
    fetchDrivers();
    
    const storedShifts = localStorage.getItem('shifts');
    if (storedShifts) {
      const parsedShifts = JSON.parse(storedShifts);
      setShifts(parsedShifts);
      
      updateStats(parsedShifts);
    } else {
      setShifts([]);
      localStorage.setItem('shifts', JSON.stringify([]));
      
      updateStats([]);
    }
  }, [fetchDrivers, updateStats]);

  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
    updateStats(shifts);
  }, [shifts, updateStats]);

  const handleAddShift = useCallback((shift: Omit<Shift, 'id'>) => {
    if (!isAdmin && profile && shift.driverId !== profile.id) {
      toast({
        title: "Acceso denegado",
        description: "Solo puedes asignar turnos a ti mismo.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for overlapping shifts for the same day and hour range
    const shiftDate = new Date(shift.date);
    const startHour = shift.startHour || 0;
    const endHour = shift.isFullDay ? startHour + 24 : startHour + 12;
    
    const overlappingShift = shifts.find(s => {
      const existingDate = new Date(s.date);
      const existingStartHour = s.startHour || 0;
      const existingEndHour = s.isFullDay ? existingStartHour + 24 : existingStartHour + 12;
      
      const sameDay = existingDate.toDateString() === shiftDate.toDateString();
      
      // Check if hours overlap
      const hoursOverlap = (
        (startHour >= existingStartHour && startHour < existingEndHour) ||
        (endHour > existingStartHour && endHour <= existingEndHour) ||
        (startHour <= existingStartHour && endHour >= existingEndHour)
      );
      
      return sameDay && hoursOverlap;
    });
    
    if (overlappingShift) {
      if (isAdmin || overlappingShift.driverId === profile?.id) {
        // Replace the existing shift
        const updatedShifts = shifts.filter(s => s.id !== overlappingShift.id);
        const newShift = {
          id: generateId(),
          ...shift
        };
        setShifts([...updatedShifts, newShift]);
        toast({
          title: "Turno actualizado",
          description: "El turno existente ha sido reemplazado exitosamente.",
        });
      } else {
        toast({
          title: "Turnos solapados",
          description: "Ya existe un turno asignado para este periodo. Por favor elige otro horario.",
          variant: "destructive"
        });
      }
    } else {
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
    const shiftToDelete = shifts.find(s => s.id === id);
    
    if (!shiftToDelete) {
      toast({
        title: "Error",
        description: "No se encontró el turno",
        variant: "destructive"
      });
      return;
    }
    
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
