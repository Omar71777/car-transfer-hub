
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, InfoIcon, Car, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ShiftSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Información</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/transfers">
            Ver Transfers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-primary" />
            Información de la Aplicación
          </CardTitle>
          <CardDescription>
            Novedades y actualizaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <Car className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Gestiona tus transfers fácilmente desde la sección de transfers.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
              <FileText className="h-4 w-4 text-emerald-500" />
              <AlertDescription>
                Consulta tus informes financieros en la sección de ganancias.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="text-center py-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Utiliza las funcionalidades de la aplicación para gestionar tus transfers,
              gastos y colaboradores de manera eficiente.
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <Button asChild variant="outline">
                <Link to="/transfers">Ver Transfers</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/profits">Ver Ganancias</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
