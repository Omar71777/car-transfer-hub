
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';
import { ShiftStats } from '@/components/shifts/ShiftStats';
import { ShiftTimetable } from '@/components/shifts/ShiftTimetable';
import { useShifts } from '@/hooks/useShifts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';

const ShiftsPage = () => {
  const { shifts, drivers, stats, handleAddShift, handleDeleteShift } = useShifts();
  const [activeTab, setActiveTab] = useState<string>("calendar");

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
        </div>
        
        {/* Dashboard stats for shifts */}
        <ShiftStats stats={stats} />
        
        {/* Tabs for different views */}
        <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Vista Calendario
            </TabsTrigger>
            <TabsTrigger value="timetable">
              <Clock className="mr-2 h-4 w-4" />
              Tabla de Horarios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-4">
            <ShiftCalendar 
              shifts={shifts} 
              drivers={drivers} 
              onAddShift={handleAddShift} 
              onDeleteShift={handleDeleteShift} 
            />
          </TabsContent>
          
          <TabsContent value="timetable" className="mt-4">
            <ShiftTimetable 
              shifts={shifts} 
              drivers={drivers} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
