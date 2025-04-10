
import { useState, useEffect, useCallback } from 'react';
import { Shift } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { parseISO, addHours, isWithinInterval } from 'date-fns';

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

  // Helper function to check if shifts overlap
  const doShiftsOverlap = useCallback((shift1: Omit<Shift, 'id'>, shift2: Shift): boolean => {
    const shift1Date = parseISO(shift1.date);
    const shift1StartHour = shift1.startHour || 0;
    const shift1Duration = shift1.isFullDay ? 24 : 12;
    
    const shift2Date = parseISO(shift2.date);
    const shift2StartHour = shift2.startHour || 0;
    const shift2Duration = shift2.isFullDay ? 24 : 12;
    
    // Create date objects for shift start and end times
    const shift1Start = new Date(shift1Date);
    shift1Start.setHours(shift1StartHour, 0, 0, 0);
    
    const shift1End = addHours(shift1Start, shift1Duration);
    
    const shift2Start = new Date(shift2Date);
    shift2Start.setHours(shift2StartHour, 0, 0, 0);
    
    const shift2End = addHours(shift2Start, shift2Duration);
    
    // Check if one shift starts exactly when the other ends - this is NOT an overlap
    if (shift1Start.getTime() === shift2End.getTime() || shift1End.getTime() === shift2Start.getTime()) {
      return false;
    }
    
    // Check if one shift is completely inside another
    return (
      isWithinInterval(shift1Start, { start: shift2Start, end: shift2End }) ||
      isWithinInterval(shift1End, { start: shift2Start, end: shift2End }) ||
      isWithinInterval(shift2Start, { start: shift1Start, end: shift1End }) ||
      isWithinInterval(shift2End, { start: shift1Start, end: shift1End })
    );
  }, []);

  const handleAddShift = useCallback((shift: Omit<Shift, 'id'>) => {
    if (!isAdmin && profile && shift.driverId !== profile.id) {
      toast({
        title: "Acceso denegado",
        description: "Solo puedes asignar turnos a ti mismo.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for overlapping shifts
    const overlappingShifts = shifts.filter(s => doShiftsOverlap(shift, s));
    
    if (overlappingShifts.length > 0) {
      if (isAdmin || overlappingShifts.every(s => s.driverId === profile?.id)) {
        // Replace the existing shifts if user has permission
        const updatedShifts = shifts.filter(s => !overlappingShifts.some(os => os.id === s.id));
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
  }, [shifts, isAdmin, profile, toast, doShiftsOverlap]);

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
