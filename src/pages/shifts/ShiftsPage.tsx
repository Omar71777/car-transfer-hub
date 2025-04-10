
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ShiftsPage = () => {
  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Esta funcionalidad no está disponible</p>
        </div>
        
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Funcionalidad no disponible</AlertTitle>
          <AlertDescription>
            La gestión de turnos no forma parte de las funcionalidades de esta aplicación.
          </AlertDescription>
        </Alert>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Gestión de Turnos</CardTitle>
            <CardDescription>
              Esta funcionalidad no está disponible en la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <p className="text-muted-foreground text-center">
              La gestión de turnos no es una característica disponible en esta aplicación.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
