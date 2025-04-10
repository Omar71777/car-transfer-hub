
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfitCalculator } from '@/components/profits/ProfitCalculator';
import { Transfer, Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, BarChart2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

// Datos de ejemplo para fallback
const dummyTransfers: Transfer[] = [
  {
    id: '1',
    date: '2025-04-09',
    time: '09:30',
    origin: 'Aeropuerto de Ibiza',
    destination: 'Hotel Ushuaïa',
    price: 85,
    collaborator: 'Carlos Sánchez',
    commission: 10,
    expenses: []
  },
  {
    id: '2',
    date: '2025-04-09',
    time: '14:45',
    origin: 'Hotel Pacha',
    destination: 'Playa d\'en Bossa',
    price: 65,
    collaborator: 'María López',
    commission: 15,
    expenses: []
  }
];

const dummyExpenses: Expense[] = [
  {
    id: '1',
    transferId: '1',
    date: '2025-04-09',
    concept: 'Combustible',
    amount: 45.50
  },
  {
    id: '2',
    transferId: '2',
    date: '2025-04-09',
    concept: 'Peaje',
    amount: 12.30
  }
];

const ProfitsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalCommissions: 0,
    netProfit: 0,
    profitMargin: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // Calculate commission for a transfer
  const calculateCommission = (transfer: Transfer) => {
    return (transfer.price * transfer.commission) / 100;
  };

  useEffect(() => {
    // Cargar transfers desde localStorage
    const storedTransfers = localStorage.getItem('transfers');
    const loadedTransfers = storedTransfers ? JSON.parse(storedTransfers) : dummyTransfers;
    setTransfers(loadedTransfers);

    // Cargar expenses desde localStorage
    const storedExpenses = localStorage.getItem('expenses');
    const loadedExpenses = storedExpenses ? JSON.parse(storedExpenses) : dummyExpenses;
    setExpenses(loadedExpenses);

    // Calculate statistics
    if (loadedTransfers.length > 0) {
      const totalIncome = loadedTransfers.reduce((sum: number, transfer: Transfer) => 
        sum + (transfer.price || 0), 0);
      
      const totalCommissions = loadedTransfers.reduce((sum: number, transfer: Transfer) => 
        sum + ((transfer.price * transfer.commission) / 100 || 0), 0);
      
      const totalExpenses = loadedExpenses.reduce((sum: number, expense: Expense) => 
        sum + (expense.amount || 0), 0) + totalCommissions;
      
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      
      setStats({
        totalIncome,
        totalExpenses,
        totalCommissions,
        netProfit,
        profitMargin
      });

      // Generate chart data
      const chartData = [
        { name: 'Ingresos', value: totalIncome, fill: '#3b82f6' },
        { name: 'Gastos', value: totalExpenses - totalCommissions, fill: '#ef4444' },
        { name: 'Comisiones', value: totalCommissions, fill: '#f59e0b' },
        { name: 'Beneficio Neto', value: netProfit, fill: '#10b981' }
      ];
      setChartData(chartData);

      // Generate monthly data (example data - in a real app this would be calculated from actual transfers)
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      const monthlyData = months.map(month => ({
        name: month,
        ingresos: Math.floor(Math.random() * 5000) + 3000,
        gastos: Math.floor(Math.random() * 1500) + 800,
        comisiones: Math.floor(Math.random() * 500) + 200,
        beneficio: Math.floor(Math.random() * 3000) + 2000,
      }));
      setMonthlyData(monthlyData);
    }
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Ganancias</h1>
          <p className="text-muted-foreground">Analiza tus ingresos, gastos y beneficios</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card shine-effect border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                  <h3 className="text-2xl font-bold text-blue-500 mt-1">{stats.totalIncome.toFixed(2)}€</h3>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shine-effect border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
                  <h3 className="text-2xl font-bold text-red-500 mt-1">{(stats.totalExpenses - stats.totalCommissions).toFixed(2)}€</h3>
                </div>
                <TrendingDown className="h-10 w-10 text-red-500/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shine-effect border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Comisiones</p>
                  <h3 className="text-2xl font-bold text-amber-500 mt-1">{stats.totalCommissions.toFixed(2)}€</h3>
                </div>
                <CreditCard className="h-10 w-10 text-amber-500/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shine-effect border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Beneficio Neto</p>
                  <h3 className="text-2xl font-bold text-green-500 mt-1">{stats.netProfit.toFixed(2)}€</h3>
                </div>
                <DollarSign className="h-10 w-10 text-green-500/40" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
              <CardDescription>Comparativa de ingresos, gastos y beneficios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    ingresos: { color: "#3b82f6" },
                    gastos: { color: "#ef4444" },
                    comisiones: { color: "#f59e0b" },
                    beneficio: { color: "#10b981" },
                  }}
                >
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}€`, '']}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Evolución Mensual</CardTitle>
              <CardDescription>Tendencia de ingresos y gastos por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    ingresos: { color: "#3b82f6" },
                    gastos: { color: "#ef4444" },
                    comisiones: { color: "#f59e0b" },
                    beneficio: { color: "#10b981" },
                  }}
                >
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}€`, '']}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="comisiones" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="beneficio" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profit Calculator */}
        <div className="mb-8">
          <ProfitCalculator transfers={transfers} expenses={expenses} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfitsPage;
