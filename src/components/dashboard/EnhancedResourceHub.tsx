
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  ExternalLink, 
  Clock, 
  Star,
  Search
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

export function EnhancedResourceHub() {
  const [searchText, setSearchText] = useState('');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  const resources = [
    {
      title: "Guía de Transferencias",
      description: "Aprende cómo gestionar transferencias de forma eficiente",
      icon: BookOpen,
      link: "/docs/transfers-guide",
      isNew: true,
      timeToRead: "5 min",
      tags: ["guía", "transferencias", "gestión"]
    },
    {
      title: "Informes y Análisis",
      description: "Accede a los informes detallados de transfers y gastos",
      icon: FileText,
      link: "/admin/reports/transfers",
      isNew: false,
      timeToRead: "10 min",
      tags: ["informes", "análisis", "datos"]
    },
    {
      title: "Consejos de Productividad",
      description: "Optimiza tu flujo de trabajo con estos consejos",
      icon: Lightbulb,
      link: "/docs/productivity-tips",
      isNew: true,
      timeToRead: "3 min",
      tags: ["consejos", "productividad", "optimización"]
    }
  ];
  
  // Filter resources based on search text
  const filteredResources = searchText.length > 0 
    ? resources.filter(resource => 
        resource.title.toLowerCase().includes(searchText.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchText.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
    : resources;
    
  const cardVariants = {
    hover: { y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" },
    initial: { y: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Centro de Recursos</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm rounded-md border bg-card/50 focus:outline-none focus:ring-2 focus:ring-primary/30 w-40 sm:w-auto"
            />
          </div>
          <Link to="/docs" className="text-sm text-primary hover:underline flex items-center">
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={isHovered === index ? "hover" : "initial"}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Card className="h-full border border-primary/10 bg-card/95 backdrop-blur-sm transition-all duration-300">
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full justify-between hover:bg-primary/5">
                    <Link to={resource.link}>
                      Acceder
                      <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 p-6 text-center bg-muted/20 rounded-lg">
            <div className="mb-2">
              <Search className="h-8 w-8 mx-auto text-muted-foreground" />
            </div>
            <h3 className="font-medium">No se encontraron recursos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Intenta con otros términos de búsqueda
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setSearchText('')}
            >
              Mostrar todos
            </Button>
          </div>
        )}
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
