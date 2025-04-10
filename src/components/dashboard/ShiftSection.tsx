
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Users, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShiftOverview } from '@/components/shifts/ShiftOverview';
import { Shift } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ShiftSectionProps {
  upcomingShifts: Array<Shift & { driverName: string }>;
  loading?: boolean;
}

export const ShiftSection = ({ upcomingShifts, loading = false }: ShiftSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Próximos Turnos</span>
            <Button variant="ghost" size="sm" asChild className="text-primary">
              <Link to="/shifts">
                <span>Ver todos</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardTitle>
          <CardDescription>Turnos programados para los próximos días</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-16" />
              ))}
            </div>
          ) : upcomingShifts.length > 0 ? (
            <div className="space-y-3">
              {upcomingShifts.map((shift) => (
                <div 
                  key={shift.id} 
                  className={`p-3 rounded-lg flex justify-between items-center ${
                    shift.isFullDay 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-secondary/10 border border-secondary/20'
                  }`}
                >
                  <div>
                    <div className="font-medium">{shift.driverName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(shift.date), 'EEEE, d MMMM', { locale: es })}
                    </div>
                    {shift.startHour !== undefined && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {`${shift.startHour}:00 - ${
                          shift.isFullDay 
                            ? shift.startHour === 0 ? '24:00' : `${shift.startHour}:00 (+24h)` 
                            : `${(shift.startHour + 12) % 24}:00`
                        }`}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    shift.isFullDay 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary/20 text-secondary'
                  }`}>
                    {shift.isFullDay ? 'Turno 24h' : 'Turno 12h'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No hay turnos programados próximamente</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/shifts">Asignar Turnos</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Distribución de Turnos</CardTitle>
          <CardDescription>Visualización semanal de turnos asignados</CardDescription>
        </CardHeader>
        <CardContent>
          <ShiftOverview />
        </CardContent>
      </Card>
    </div>
  );
};
