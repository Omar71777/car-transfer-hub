
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Star, 
  Map, 
  Info, 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Sample data
const insightsData = [
  {
    title: "Día más ocupado",
    value: "Viernes",
    change: "+12%",
    trend: "up",
    insight: "Los viernes tienen un 12% más de transfers que el resto de días."
  },
  {
    title: "Destino más popular",
    value: "Aeropuerto",
    change: "+8%",
    trend: "up",
    insight: "El 45% de los transfers tienen como destino el aeropuerto."
  },
  {
    title: "Colaborador destacado",
    value: "Carlos R.",
    change: "+15%",
    trend: "up",
    insight: "Ha realizado un 15% más de transfers que el mes pasado."
  },
  {
    title: "Próxima temporada alta",
    value: "Jul-Ago",
    change: "-2 meses",
    trend: "neutral",
    insight: "Prepárate para un aumento del 40% en la demanda."
  }
];

// Sample chart data
const performanceData = [
  { name: 'Lun', transfers: 4, actual: 400, target: 500 },
  { name: 'Mar', transfers: 3, actual: 300, target: 400 },
  { name: 'Mie', transfers: 2, actual: 200, target: 350 },
  { name: 'Jue', transfers: 6, actual: 600, target: 500 },
  { name: 'Vie', transfers: 8, actual: 780, target: 600 },
  { name: 'Sab', transfers: 9, actual: 890, target: 700 },
  { name: 'Dom', transfers: 6, actual: 690, target: 500 },
];

// Colors for the bar chart
const barColors = [
  "#4318FF", "#6AD2FF", "#EFF4FB"
];

export function BusinessInsights() {
  const [timeframe, setTimeframe] = useState('week');
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 shadow-lg rounded-md">
          <p className="font-medium text-xs">{`${label}`}</p>
          <p className="text-xs text-green-500">{`Ingresos: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-xs text-primary opacity-70">{`Objetivo: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">Indicadores de Negocio</h2>
        <Badge variant="outline" className="flex items-center">
          <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          <span>Análisis Semanal</span>
        </Badge>
      </div>
      
      <Card className="border border-primary/10 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Rendimiento vs Objetivo</CardTitle>
            <Tabs value={timeframe} onValueChange={setTimeframe} className="h-8">
              <TabsList className="h-8">
                <TabsTrigger value="week" className="text-xs h-7 px-3">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs h-7 px-3">Mes</TabsTrigger>
                <TabsTrigger value="year" className="text-xs h-7 px-3">Año</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Compara tus ingresos actuales con los objetivos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="h-[180px] w-full px-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barGap={4}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `€${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="actual" fill={barColors[0]} name="Ingresos" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-actual-${index}`}
                      fill={entry.actual >= entry.target ? "#4CAF50" : "#4318FF"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="target" fill="#E0E1E9" name="Objetivo" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/30 mt-4 py-3">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Por encima del objetivo</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Por debajo del objetivo</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightsData.map((insight, index) => (
          <Card key={index} className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="text-2xl font-bold">{insight.value}</div>
                <div className={`flex items-center ${
                  insight.trend === 'up' ? 'text-green-500' : 
                  insight.trend === 'down' ? 'text-red-500' : 
                  'text-amber-500'
                }`}>
                  {insight.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : insight.trend === 'down' ? (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  ) : (
                    <Calendar className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">{insight.change}</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{insight.insight}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Consejo de Negocio</CardTitle>
            </div>
            <Badge variant="secondary">Personalizado</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Basado en tus datos recientes, considera aumentar la disponibilidad los viernes y enfocarte en el servicio de aeropuerto para maximizar tus ingresos.</p>
        </CardContent>
        <CardFooter className="border-t border-border/30 pt-3 flex justify-between">
          <Button variant="ghost" size="sm" className="text-xs">
            ¿Te ha sido útil?
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver más consejos
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
