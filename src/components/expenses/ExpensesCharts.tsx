
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { Expense } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

// Custom colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface ExpenseChartData {
  name: string;
  value: number;
  percentage: number;
}

interface MonthlyExpenseData {
  month: string;
  total: number;
}

interface ExpensesChartsProps {
  expenses: Expense[];
  loading: boolean;
}

export const ExpensesCharts: React.FC<ExpensesChartsProps> = ({ expenses, loading }) => {
  const isMobile = useIsMobile();
  
  // Group expenses by concept (category)
  const expensesByConcept = useMemo(() => {
    if (!expenses.length) return [];

    const conceptGroups: { [key: string]: number } = {};
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    expenses.forEach(expense => {
      const concept = expense.concept || 'Sin categoría';
      conceptGroups[concept] = (conceptGroups[concept] || 0) + expense.amount;
    });
    
    return Object.entries(conceptGroups)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / total) * 100
      }))
      .sort((a, b) => b.value - a.value); // Sort by highest value
  }, [expenses]);

  // Group expenses by month
  const expensesByMonth = useMemo(() => {
    if (!expenses.length) return [];

    const monthGroups: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (!expense.date) return;
      
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthGroups[monthYear] = (monthGroups[monthYear] || 0) + expense.amount;
    });
    
    return Object.entries(monthGroups)
      .map(([monthYear, total]) => {
        // Convert month number to name
        const [month, year] = monthYear.split('/');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const monthName = monthNames[parseInt(month) - 1];
        
        return {
          month: `${monthName} ${year}`,
          total
        };
      })
      .sort((a, b) => {
        // Sort by date
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const aMonthNum = monthNames.indexOf(aMonth);
        const bMonthNum = monthNames.indexOf(bMonth);
        
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return aMonthNum - bMonthNum;
      });
  }, [expenses]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cargando análisis de gastos...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32 md:h-64">
          <p className="text-muted-foreground">Cargando datos...</p>
        </CardContent>
      </Card>
    );
  }

  if (!expenses.length) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Análisis de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32 md:h-64">
          <p className="text-muted-foreground">No hay gastos registrados para analizar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Análisis de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Por Categoría</TabsTrigger>
            <TabsTrigger value="monthly">Por Mes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="w-full">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByConcept}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 80 : 100}
                        label={({ name, percent }) => 
                          isMobile ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={!isMobile}
                      >
                        {expensesByConcept.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border shadow-lg p-2 rounded-md">
                              <p className="font-medium">{data.name}</p>
                              <p>{formatCurrency(data.value)}</p>
                              <p className="text-xs">{data.percentage.toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <ScrollArea className="h-[250px] md:h-[300px] pr-4 better-scrollbar">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Categoría</th>
                        <th className="text-right py-2">Importe</th>
                        <th className="text-right py-2">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expensesByConcept.map((item, index) => (
                        <tr key={index} className="border-b border-muted hover:bg-muted/50">
                          <td className="py-2 flex items-center">
                            <span 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.name}
                          </td>
                          <td className="text-right py-2">{formatCurrency(item.value)}</td>
                          <td className="text-right py-2">{item.percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="w-full">
            <div className="h-[250px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesByMonth}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: isMobile ? 60 : 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${formatCurrency(value)}`}
                    width={isMobile ? 60 : 80}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Gastos en ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Bar name="Total de Gastos" dataKey="total" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
