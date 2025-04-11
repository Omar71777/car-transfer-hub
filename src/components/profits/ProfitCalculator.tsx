
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transfer, Expense } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

interface ProfitCalculatorProps {
  transfers: Transfer[];
  expenses: Expense[];
}

export function ProfitCalculator({ transfers, expenses }: ProfitCalculatorProps) {
  const [tab, setTab] = useState('daily');
  
  // Calcular ganancias diarias
  const calculateDailyData = () => {
    const currentDate = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(day => {
      const dayTransfers = transfers.filter(t => isSameDay(new Date(t.date), day));
      const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), day));
      
      // Use the consistent calculation methods from lib/calculations
      const income = dayTransfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
      const commissionsTotal = dayTransfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
      const expense = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = income - expense - commissionsTotal;
      
      return {
        date: format(day, 'dd/MM'),
        income,
        expense,
        commission: commissionsTotal,
        profit,
      };
    });
  };

  // Calcular ganancias mensuales
  const calculateMonthlyData = () => {
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

    const monthlyData = daysInMonth.map(day => {
      const dayTransfers = transfers.filter(t => isSameDay(new Date(t.date), day));
      const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), day));
      
      // Use the consistent calculation methods from lib/calculations
      const income = dayTransfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
      const commissionsTotal = dayTransfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
      const expense = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        day,
        income,
        expense,
        commission: commissionsTotal,
      };
    });

    // Agrupar por semanas
    const weeks = [];
    for (let i = 0; i < monthlyData.length; i += 7) {
      const weekData = monthlyData.slice(i, i + 7);
      const weekIncome = weekData.reduce((sum, d) => sum + d.income, 0);
      const weekExpense = weekData.reduce((sum, d) => sum + d.expense, 0);
      const weekCommission = weekData.reduce((sum, d) => sum + d.commission, 0);
      const weekProfit = weekIncome - weekExpense - weekCommission;
      
      const weekStart = weekData[0]?.day || firstDayOfMonth;
      const weekEnd = weekData[weekData.length - 1]?.day || weekStart;
      
      weeks.push({
        date: `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
        income: weekIncome,
        expense: weekExpense,
        commission: weekCommission,
        profit: weekProfit,
      });
    }
    
    return weeks;
  };

  // Calcular totales using the consistent calculation methods
  const calculateTotals = () => {
    const totalIncome = transfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
    const totalCommissions = transfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
    // Gastos are only regular expenses (without commissions)
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalIncome - totalExpense - totalCommissions;
    
    return { totalIncome, totalExpense, totalCommissions, totalProfit };
  };

  const dailyData = calculateDailyData();
  const monthlyData = calculateMonthlyData();
  const { totalIncome, totalExpense, totalCommissions, totalProfit } = calculateTotals();

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle>Calculadora de Ganancias</CardTitle>
        <CardDescription>Visualiza los ingresos, gastos y ganancias netas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base text-ibiza-500">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base text-destructive">Gastos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base text-amber-500">Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalCommissions)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base text-green-600">Ganancias Netas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="daily" className="flex-1">Ganancias Diarias</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">Ganancias Mensuales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="income" name="Ingresos" fill="#3b82f6" />
                  <Bar dataKey="expense" name="Gastos" fill="#ef4444" />
                  <Bar dataKey="commission" name="Comisiones" fill="#f59e0b" />
                  <Bar dataKey="profit" name="Ganancia" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="income" name="Ingresos" fill="#3b82f6" />
                  <Bar dataKey="expense" name="Gastos" fill="#ef4444" />
                  <Bar dataKey="commission" name="Comisiones" fill="#f59e0b" />
                  <Bar dataKey="profit" name="Ganancia" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
