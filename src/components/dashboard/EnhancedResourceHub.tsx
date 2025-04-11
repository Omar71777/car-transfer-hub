
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, FileText, Lightbulb, ExternalLink, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function EnhancedResourceHub() {
  const resources = [
    {
      title: "Guía de Transferencias",
      description: "Aprende cómo gestionar transferencias de forma eficiente",
      icon: BookOpen,
      link: "/docs/transfers-guide",
      isNew: true,
      timeToRead: "5 min"
    },
    {
      title: "Informes y Análisis",
      description: "Accede a los informes detallados de transfers y gastos",
      icon: FileText,
      link: "/admin/reports/transfers",
      isNew: false,
      timeToRead: "10 min"
    },
    {
      title: "Consejos de Productividad",
      description: "Optimiza tu flujo de trabajo con estos consejos",
      icon: Lightbulb,
      link: "/docs/productivity-tips",
      isNew: true,
      timeToRead: "3 min"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Centro de Recursos</h2>
        <Link to="/docs" className="text-sm text-primary hover:underline flex items-center">
          Ver todos <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="hover-lift group transition-all duration-300 border border-primary/10">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                {resource.isNew && (
                  <Badge variant="default" className="bg-primary/80 hover:bg-primary text-white">Nuevo</Badge>
                )}
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <resource.icon className="h-5 w-5" />
              </div>
              <CardTitle className="flex items-center text-lg group-hover:text-primary transition-colors">
                {resource.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{resource.timeToRead} de lectura</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                <Link to={resource.link}>
                  Acceder
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Alert className="bg-primary/5 border-primary/20">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertDescription>
          Todos los recursos se actualizan regularmente con la información más reciente.
        </AlertDescription>
      </Alert>
    </div>
  );
}
