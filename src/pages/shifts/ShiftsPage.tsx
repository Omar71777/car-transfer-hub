
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';

const ShiftsPage = () => {
  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Página no disponible</h1>
          <p className="text-muted-foreground">Esta página ya no está disponible en la aplicación</p>
        </div>
        
        <Card className="glass-card">
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              Esta funcionalidad ha sido eliminada de la aplicación.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
