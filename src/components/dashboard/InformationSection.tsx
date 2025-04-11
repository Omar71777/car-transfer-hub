
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, InfoIcon, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function InformationSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary">Información y Recursos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Informes y Análisis
            </CardTitle>
            <CardDescription>
              Accede a los informes detallados de transfers y gastos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Visualiza tendencias, analiza rendimiento y exporta informes para optimizar tu negocio.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/reports/transfers">
                  Ver Informes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Recuerda mantener actualizada la información de transfers y gastos para obtener informes precisos.
        </AlertDescription>
      </Alert>
    </div>
  );
}
