
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const ShiftsPage = () => {
  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Organiza los turnos de los conductores</p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>Funcionalidad en desarrollo</AlertTitle>
          <AlertDescription>
            El planificador de turnos está actualmente en fase de desarrollo. 
            Estamos trabajando para implementar una solución robusta que permita gestionar los turnos de forma eficiente.
          </AlertDescription>
        </Alert>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Planificador de Turnos
            </CardTitle>
            <CardDescription>
              El planificador de turnos estará disponible próximamente
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md">
              <p className="text-muted-foreground mb-4">
                Estamos desarrollando un planificador de turnos intuitivo que te permitirá gestionar los horarios de los conductores de forma eficiente.
              </p>
              <img 
                src="/lovable-uploads/edcc9b22-f51b-443a-b987-66de8a970664.png" 
                alt="Diseño del planificador de turnos" 
                className="max-w-full h-auto rounded-md border mx-auto"
                style={{ maxHeight: '300px' }}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                Imagen de referencia del diseño que estamos implementando
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
