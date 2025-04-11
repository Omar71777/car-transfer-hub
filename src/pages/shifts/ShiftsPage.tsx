
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ShiftsPage = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Página no disponible</h1>
          <p className="text-muted-foreground">Esta página ya no está disponible en la aplicación</p>
        </div>
        
        <Card className="glass-card">
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground mb-6">
                Esta funcionalidad ha sido eliminada de la aplicación. Por favor, utiliza la sección de informes en la página de Transfers para consultar información sobre pagos pendientes.
              </p>
              
              <Button onClick={() => navigate('/transfers')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Transfers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ShiftsPage;
