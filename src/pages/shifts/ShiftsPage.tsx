import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';
import { Shift } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CalendarClock, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ShiftsPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const { toast } = useToast();
  const { isAdmin, profile } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    fullDay: 0,
    halfDay: 0
  });
  const [activeTab, setActiveTab] = useState('shifts');

  // Fetch users (drivers) from Supabase
  const fetchDrivers = async () => {
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
  };

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    // Fetch drivers (users) from Supabase
    fetchDrivers();
    
    // Cargar turnos
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
  }, []);

  // Update stats based on shifts
  const updateStats = (currentShifts: Shift[]) => {
    setStats({
      total: currentShifts.length,
      fullDay: currentShifts.filter(s => s.isFullDay).length,
      halfDay: currentShifts.filter(s => !s.isFullDay).length
    });
  };

  // Guardar turnos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
    updateStats(shifts);
  }, [shifts]);

  const handleAddShift = (shift: Omit<Shift, 'id'>) => {
    // If not admin, only allow adding shifts for self
    if (!isAdmin && profile && shift.driverId !== profile.id) {
      toast({
        title: "Acceso denegado",
        description: "Solo puedes asignar turnos a ti mismo.",
        variant: "destructive"
      });
      return;
    }
    
    // Comprobar si ya existe un turno para esa fecha
    const existingShift = shifts.find(s => s.date === shift.date);
    
    if (existingShift) {
      // Actualizar el turno existente si es admin o su propio turno
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
      // Crear un nuevo turno
      const newShift = {
        id: generateId(),
        ...shift
      };
      setShifts([...shifts, newShift]);
      toast({
        title: "Turno asignado",
        description: "El turno ha sido asignado exitosamente.",
      });
    }
  };

  const handleDeleteShift = (id: string) => {
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
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
        </div>
        
        {/* Dashboard stats for shifts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card shine-effect border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Turnos</p>
                  <h3 className="text-3xl font-bold text-primary mt-1">{stats.total}</h3>
                </div>
                <CalendarClock className="h-10 w-10 text-primary/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shine-effect border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turnos 24h</p>
                  <h3 className="text-3xl font-bold text-accent mt-1">{stats.fullDay}</h3>
                </div>
                <Clock className="h-10 w-10 text-accent/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shine-effect border-l-4 border-l-secondary">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turnos 12h</p>
                  <h3 className="text-3xl font-bold text-secondary mt-1">{stats.halfDay}</h3>
                </div>
                <Clock className="h-10 w-10 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <ShiftCalendar 
          shifts={shifts} 
          drivers={drivers} 
          onAddShift={handleAddShift} 
          onDeleteShift={handleDeleteShift} 
        />
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
