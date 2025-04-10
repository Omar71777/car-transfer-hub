
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight, TrendingUp, Car, Users, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Transfer, Expense, Shift, Driver } from '@/types';
import { ShiftOverview } from '@/components/shifts/ShiftOverview';
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalTransfers: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    upcomingShifts: 0
  });
  const [upcomingShifts, setUpcomingShifts] = useState<Array<Shift & { driverName: string }>>([]);

  // Load data for KPIs
  useEffect(() => {
    // Load transfers
    const storedTransfers = localStorage.getItem('transfers');
    const transfers = storedTransfers ? JSON.parse(storedTransfers) : [];
    
    // Load expenses
    const storedExpenses = localStorage.getItem('expenses');
    const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    
    // Load shifts
    const storedShifts = localStorage.getItem('shifts');
    const shifts = storedShifts ? JSON.parse(storedShifts) : [];
    
    // Load drivers
    const storedDrivers = localStorage.getItem('drivers');
    const drivers = storedDrivers ? JSON.parse(storedDrivers) : [];
    
    // Calculate stats
    const totalTransfers = transfers.length;
    const totalIncome = transfers.reduce((sum: number, transfer: Transfer) => sum + (transfer.price || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + (expense.amount || 0), 0);
    const netIncome = totalIncome - totalExpenses;
    
    // Get upcoming shifts (next 7 days)
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    const upcoming = shifts
      .filter((shift: Shift) => {
        const shiftDate = new Date(shift.date);
        return isWithinInterval(shiftDate, {
          start: startOfDay(today),
          end: endOfDay(nextWeek)
        });
      })
      .map((shift: Shift) => {
        const driver = drivers.find((d: Driver) => d.id === shift.driverId);
        return {
          ...shift,
          driverName: driver ? driver.name : 'Conductor no asignado'
        };
      })
      .sort((a: Shift, b: Shift) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setStats({
      totalTransfers,
      totalIncome,
      totalExpenses,
      netIncome,
      upcomingShifts: upcoming.length
    });
    
    setUpcomingShifts(upcoming.slice(0, 3));
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-2 text-primary">Bienvenido a Ibiza Transfer Hub</h1>
        <p className="text-muted-foreground mb-8">Gestiona tus transfers, gastos, ganancias y turnos desde un solo lugar.</p>
        
        {isAdmin && (
          <Card className="glass-card mb-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Acceso Administrador</h3>
                  <p className="text-sm text-muted-foreground">Tienes acceso a funciones administrativas exclusivas.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/users">
                    Gestionar Usuarios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* KPI Stats Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-primary">Resumen de Actividad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card from-blue-500 to-blue-600 animated-gradient bg-gradient-to-r text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Transfers</h3>
                <Car className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.totalTransfers}</p>
                <p className="text-xs opacity-80 mt-1">Servicios totales</p>
              </div>
            </div>
            
            <div className="stat-card from-green-500 to-green-600 animated-gradient bg-gradient-to-r text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Ingresos</h3>
                <TrendingUp className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.totalIncome}€</p>
                <p className="text-xs opacity-80 mt-1">Ingresos totales</p>
              </div>
            </div>
            
            <div className="stat-card from-red-500 to-red-600 animated-gradient bg-gradient-to-r text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Gastos</h3>
                <CreditCard className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.totalExpenses}€</p>
                <p className="text-xs opacity-80 mt-1">Gastos totales</p>
              </div>
            </div>
            
            <div className="stat-card from-purple-500 to-indigo-600 animated-gradient bg-gradient-to-r text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Beneficio</h3>
                <BarChart2 className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.netIncome}€</p>
                <p className="text-xs opacity-80 mt-1">Ingresos netos</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Tarjeta de acceso rápido a Nuevos Transfers */}
          <Card className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                <span>Nuevo Transfer</span>
              </CardTitle>
              <CardDescription>Registra un nuevo servicio</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mt-2" variant="default">
                <Link to="/transfers/new">
                  Crear Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de acceso rápido a Transfers */}
          <Card className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Transfers</span>
              </CardTitle>
              <CardDescription>Gestiona tus servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mt-2" variant="outline">
                <Link to="/transfers">
                  Ver Transfers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de acceso rápido a Gastos */}
          <Card className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Gastos</span>
              </CardTitle>
              <CardDescription>Controla tus gastos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mt-2" variant="outline">
                <Link to="/expenses">
                  Ver Gastos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de acceso rápido a Ganancias */}
          <Card className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <span>Ganancias</span>
              </CardTitle>
              <CardDescription>Analiza tus resultados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mt-2" variant="outline">
                <Link to="/profits">
                  Ver Ganancias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Replacing the promotional section with upcoming shifts visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              {upcomingShifts.length > 0 ? (
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

        <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>Gestión de Conductores</CardTitle>
            <CardDescription>Añade, modifica y elimina conductores para tu flota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Administra los perfiles de tus conductores para asignarles turnos y servicios
              </p>
              <Button asChild>
                <Link to="/shifts">
                  Gestionar Conductores
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
