
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Clock } from 'lucide-react';

interface ShiftStatsProps {
  stats: {
    total: number;
    fullDay: number;
    halfDay: number;
  };
}

export function ShiftStats({ stats }: ShiftStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <Card className="glass-card shine-effect border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Turnos</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{stats.total}</h3>
            </div>
            <CalendarClock className="h-10 w-10 text-primary/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shine-effect border-l-4 border-l-accent">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Turnos 24h</p>
              <h3 className="text-3xl font-bold text-accent mt-1">{stats.fullDay}</h3>
            </div>
            <Clock className="h-10 w-10 text-accent/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shine-effect border-l-4 border-l-secondary">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Turnos 12h</p>
              <h3 className="text-3xl font-bold text-secondary mt-1">{stats.halfDay}</h3>
            </div>
            <Clock className="h-10 w-10 text-secondary/40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
