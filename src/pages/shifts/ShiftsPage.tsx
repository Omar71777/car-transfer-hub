
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';
import { DriverManagement } from '@/components/shifts/DriverManagement';
import { Shift, Driver } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, CalendarClock, Clock } from 'lucide-react';

// Datos de ejemplo (simulando lo que vendría de Firebase)
const dummyDrivers: Driver[] = [
  { id: '1', name: 'Carlos Sánchez', email: 'carlos@example.com' },
  { id: '2', name: 'María López', email: 'maria@example.com' },
  { id: '3', name: 'Juan Pérez', email: 'juan@example.com' },
  { id: '4', name: 'Ana Martínez', email: 'ana@example.com' }
];

const dummyShifts: Shift[] = [
  { id: '1', date: '2025-04-09', driverId: '1', isFullDay: false },
  { id: '2', date: '2025-04-10', driverId: '2', isFullDay: true },
  { id: '3', date: '2025-04-11', driverId: '3', isFullDay: false },
  { id: '4', date: '2025-04-12', driverId: '4', isFullDay: true }
];

const ShiftsPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    total: 0,
    fullDay: 0,
    halfDay: 0
  });
  const [activeTab, setActiveTab] = useState('shifts');

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    // Cargar turnos
    const storedShifts = localStorage.getItem('shifts');
    if (storedShifts) {
      const parsedShifts = JSON.parse(storedShifts);
      setShifts(parsedShifts);
      
      // Calculate stats
      setStats({
        total: parsedShifts.length,
        fullDay: parsedShifts.filter((s: Shift) => s.isFullDay).length,
        halfDay: parsedShifts.filter((s: Shift) => !s.isFullDay).length
      });
    } else {
      setShifts(dummyShifts);
      localStorage.setItem('shifts', JSON.stringify(dummyShifts));
      
      // Set initial stats
      setStats({
        total: dummyShifts.length,
        fullDay: dummyShifts.filter(s => s.isFullDay).length,
        halfDay: dummyShifts.filter(s => !s.isFullDay).length
      });
    }

    // Cargar conductores
    const storedDrivers = localStorage.getItem('drivers');
    if (storedDrivers) {
      setDrivers(JSON.parse(storedDrivers));
    } else {
      setDrivers(dummyDrivers);
      localStorage.setItem('drivers', JSON.stringify(dummyDrivers));
    }
  }, []);

  // Guardar turnos en localStorage cada vez que cambian
  useEffect(() => {
    if (shifts.length > 0) {
      localStorage.setItem('shifts', JSON.stringify(shifts));
      
      // Update stats when shifts change
      setStats({
        total: shifts.length,
        fullDay: shifts.filter(s => s.isFullDay).length,
        halfDay: shifts.filter(s => !s.isFullDay).length
      });
    }
  }, [shifts]);

  // Guardar conductores en localStorage cada vez que cambian
  useEffect(() => {
    if (drivers.length > 0) {
      localStorage.setItem('drivers', JSON.stringify(drivers));
    }
  }, [drivers]);

  const handleAddShift = (shift: Omit<Shift, 'id'>) => {
    // Comprobar si ya existe un turno para esa fecha
    const existingShift = shifts.find(s => s.date === shift.date);
    
    if (existingShift) {
      // Actualizar el turno existente
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
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "Turno eliminado",
      description: "El turno ha sido eliminado exitosamente.",
    });
  };

  const handleAddDriver = (driver: Omit<Driver, 'id'>) => {
    const newDriver = {
      id: generateId(),
      ...driver
    };
    setDrivers([...drivers, newDriver]);
    toast({
      title: "Conductor añadido",
      description: "El conductor ha sido añadido exitosamente.",
    });
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    const updatedDrivers = drivers.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    );
    setDrivers(updatedDrivers);
    toast({
      title: "Conductor actualizado",
      description: "Los datos del conductor han sido actualizados exitosamente.",
    });
  };

  const handleDeleteDriver = (id: string) => {
    // Check if driver has assigned shifts
    const hasShifts = shifts.some(shift => shift.driverId === id);
    
    if (hasShifts) {
      toast({
        title: "No se puede eliminar",
        description: "Este conductor tiene turnos asignados. Reasigna o elimina sus turnos primero.",
        variant: "destructive"
      });
      return;
    }
    
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({
      title: "Conductor eliminado",
      description: "El conductor ha sido eliminado exitosamente.",
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="shifts">Calendario de Turnos</TabsTrigger>
            <TabsTrigger value="drivers">Gestión de Conductores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shifts">
            <ShiftCalendar 
              shifts={shifts} 
              drivers={drivers} 
              onAddShift={handleAddShift} 
              onDeleteShift={handleDeleteShift} 
            />
          </TabsContent>
          
          <TabsContent value="drivers">
            <DriverManagement 
              drivers={drivers}
              onAddDriver={handleAddDriver}
              onUpdateDriver={handleUpdateDriver}
              onDeleteDriver={handleDeleteDriver}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
