
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftStats } from '@/components/shifts/ShiftStats';
import { ShiftTimetable } from '@/components/shifts/ShiftTimetable';
import { useShifts } from '@/hooks/useShifts';

const ShiftsPage = () => {
  const { shifts, drivers, stats, handleAddShift, handleDeleteShift } = useShifts();

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
        </div>
        
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
