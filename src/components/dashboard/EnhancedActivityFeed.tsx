
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock, Filter, Users, Car, CreditCard, Check, BarChart2, ArrowRight, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// Simulate activity data
const getActivityData = () => {
  const now = new Date();
  
  return [
    {
      id: '1',
      type: 'transfer',
      title: 'Nuevo Transfer Registrado',
      description: 'Transfer Aeropuerto a Hotel',
      time: now,
      icon: Car,
      status: 'new',
      user: 'Admin'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pago recibido',
      description: 'Servicio #1234 - €75,00',
      time: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
      icon: CreditCard,
      status: 'completed',
      user: 'Sistema'
    },
    {
      id: '3',
      type: 'expense',
      title: 'Nuevo gasto registrado',
      description: 'Combustible - €45,00',
      time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: BarChart2,
      status: 'pending',
      user: 'Carlos'
    },
    {
      id: '4',
      type: 'transfer',
      title: 'Transfer completado',
      description: 'Hotel a Aeropuerto',
      time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: Check,
      status: 'completed',
      user: 'María'
    },
    {
      id: '5',
      type: 'payment',
      title: 'Factura enviada',
      description: 'Cliente: Hotel Paraíso',
      time: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      icon: CreditCard,
      status: 'pending',
      user: 'Admin'
    }
  ];
};

// Activity item component
const ActivityItem = ({ activity }: { activity: any }) => {
  const statusColors = {
    new: 'bg-blue-500',
    completed: 'bg-green-500',
    pending: 'bg-amber-500'
  };
  
  const typeLabels = {
    transfer: 'Transfer',
    payment: 'Pago',
    expense: 'Gasto'
  };
  
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="relative mb-6 last:mb-0">
      <div className="flex items-start gap-3">
        <div className={`absolute top-1 -left-[23px] h-3 w-3 rounded-full ${statusColors[activity.status as keyof typeof statusColors]}`}></div>
        
        <div className="flex-1 bg-card border border-border/50 rounded-lg p-3 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary">
                <activity.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {typeLabels[activity.type as keyof typeof typeLabels]}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(activity.time, 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem>Marcar como leído</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ocultar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
          
          {expanded && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Usuario:</span> {activity.user}
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">Ver Detalle</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">Relacionados</Button>
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground mt-1" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Mostrar menos' : 'Mostrar más'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export function EnhancedActivityFeed() {
  const activities = getActivityData();
  const [filter, setFilter] = useState('all');
  
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Actividad Reciente</CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('transfer')}>Transfers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('payment')}>Pagos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('expense')}>Gastos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Los últimos movimientos en tu negocio</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="timeline" className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Cronología</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            <div className="relative pl-6 border-l border-border space-y-4">
              {filteredActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              
              {filteredActivities.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No hay actividades que mostrar con este filtro.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="py-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Notificaciones de Usuarios</h3>
              <p className="text-muted-foreground mb-4">Las notificaciones de tus colaboradores aparecerán aquí.</p>
              <Button variant="outline">Configurar Notificaciones</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <div className="py-6 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Alertas de Servicios</h3>
              <p className="text-muted-foreground mb-4">Recordatorios y alertas de próximos servicios.</p>
              <Button variant="outline">Configurar Alertas</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full justify-center gap-1">
          <span>Ver todo el historial</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
