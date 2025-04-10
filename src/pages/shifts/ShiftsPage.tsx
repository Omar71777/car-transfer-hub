
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftStats } from '@/components/shifts/ShiftStats';
import { ShiftTimetable } from '@/components/shifts/ShiftTimetable';
import { useShifts } from '@/hooks/useShifts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const ShiftsPage = () => {
  const { shifts, drivers, stats, handleAddShift, handleDeleteShift } = useShifts();

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>Planificación de turnos consecutivos</AlertTitle>
          <AlertDescription>
            Para crear turnos consecutivos, simplemente asigna un nuevo turno que comience justo cuando termina el anterior.
            El sistema permite que un nuevo turno comience exactamente a la hora en que finaliza el anterior, sin solapamiento.
          </AlertDescription>
        </Alert>
        
        {/* Dashboard stats for shifts */}
        <ShiftStats stats={stats} />
        
        {/* Interactive shift timetable */}
        <div className="mt-6">
          <ShiftTimetable 
            shifts={shifts} 
            drivers={drivers} 
            onAddShift={handleAddShift}
            onDeleteShift={handleDeleteShift}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
