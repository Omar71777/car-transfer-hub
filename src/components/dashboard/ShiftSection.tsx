
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarIcon, AlertCircle } from 'lucide-react';
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
            <CalendarIcon className="h-5 w-5 text-primary" />
            Información de la Aplicación
          </CardTitle>
          <CardDescription>
            Novedades y actualizaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              La gestión de turnos no está disponible en esta aplicación.
            </AlertDescription>
          </Alert>
          
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Utiliza las demás funcionalidades de la aplicación para gestionar tus transfers,
              gastos y colaboradores.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/transfers">Ver Transfers</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
