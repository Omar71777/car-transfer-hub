
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Driver } from '@/types';
import { UserPlus } from 'lucide-react';
import { DriverFormDialog } from './driver/DriverFormDialog';
import { DriversTable } from './driver/DriversTable';

interface DriverManagementProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
}

export function DriverManagement({ 
  drivers, 
  onAddDriver, 
  onUpdateDriver, 
  onDeleteDriver 
}: DriverManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Conductores</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Conductor
        </Button>
      </CardHeader>
      <CardContent>
        <DriversTable
          drivers={drivers}
          onEdit={openEditDialog}
          onDelete={onDeleteDriver}
          onAddNew={() => setIsAddDialogOpen(true)}
        />
      </CardContent>

      {/* Add Driver Dialog */}
      <DriverFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onAddDriver}
        title="Añadir Nuevo Conductor"
        description="Introduce los datos del nuevo conductor para poder asignarle turnos."
        submitLabel="Guardar"
      />

      {/* Edit Driver Dialog */}
      <DriverFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={onUpdateDriver}
        driver={editingDriver}
        title="Editar Conductor"
        description="Modifica los datos del conductor."
        submitLabel="Guardar cambios"
      />
    </Card>
  );
}
