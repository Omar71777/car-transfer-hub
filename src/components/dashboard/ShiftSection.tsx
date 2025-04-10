
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shift } from '@/types';

interface ShiftSectionProps {
  upcomingShifts: Array<Shift & { driverName: string }>;
  loading: boolean;
}

export function ShiftSection({ upcomingShifts, loading }: ShiftSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Próximos Turnos</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/shifts">
            Ver Todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Próximos Turnos Programados
          </CardTitle>
          <CardDescription>
            Muestra los próximos turnos de los conductores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : upcomingShifts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No hay turnos programados próximamente</p>
              <p className="text-sm mt-2">
                Visita la página de turnos para gestionar los horarios de los conductores
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/shifts">Gestionar Turnos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingShifts.map((shift) => (
                <Card key={shift.id} className="p-3 transition-all bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{shift.driverName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(shift.date), 'EEEE d MMMM', { locale: es })}
                      </p>
                      <p className="text-sm">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
