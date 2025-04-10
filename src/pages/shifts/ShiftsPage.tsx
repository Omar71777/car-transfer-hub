
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';
import { Shift, Driver } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

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

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    // Cargar turnos
    const storedShifts = localStorage.getItem('shifts');
    if (storedShifts) {
      setShifts(JSON.parse(storedShifts));
    } else {
      setShifts(dummyShifts);
      localStorage.setItem('shifts', JSON.stringify(dummyShifts));
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
    }
  }, [shifts]);

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

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
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
