
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight, TrendingUp, Car, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Transfer, Expense, Shift } from '@/types';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalTransfers: 0,
    totalIncome: 0,
    totalExpenses: 0,
    activeDrivers: 0
  });

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
    
    // Calculate stats
    const totalTransfers = transfers.length;
    const totalIncome = transfers.reduce((sum: number, transfer: Transfer) => sum + (transfer.price || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + (expense.amount || 0), 0);
    
    // Count active drivers (those with shifts this week)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    const activeDriversIds = new Set(
      shifts
        .filter((shift: Shift) => {
          const shiftDate = new Date(shift.date);
          return shiftDate >= weekStart && shiftDate <= weekEnd;
        })
        .map((shift: Shift) => shift.driverId)
    );
    
    setStats({
      totalTransfers,
      totalIncome,
      totalExpenses,
      activeDrivers: activeDriversIds.size
    });
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
            
            <div className="stat-card from-purple-500 to-purple-600 animated-gradient bg-gradient-to-r text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Conductores</h3>
                <Users className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stats.activeDrivers}</p>
                <p className="text-xs opacity-80 mt-1">Conductores activos</p>
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

        <div className="relative overflow-hidden rounded-xl p-6 glass-card bg-gradient-to-r from-primary to-accent text-white shadow-lg mb-8">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative">
            <h2 className="text-xl font-bold mb-2">Maximiza tus ganancias</h2>
            <p className="max-w-3xl mb-4">
              Controla tus transfers, gastos y turnos de forma eficiente para optimizar tu operación en Ibiza.
            </p>
            <Button asChild variant="secondary">
              <Link to="/transfers">Comienza ahora</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Próximos Turnos</CardTitle>
              <CardDescription>Consulta los próximos días de trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gestiona tus turnos de 12 y 24 horas fácilmente con nuestro calendario.
              </p>
              <Button asChild variant="outline">
                <Link to="/shifts">Ver Calendario de Turnos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
              <CardDescription>Recursos para utilizar la aplicación</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explora todas las funcionalidades de Ibiza Transfer Hub para sacar el máximo provecho.
              </p>
              <Button variant="outline">Ver Guía de Uso</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
