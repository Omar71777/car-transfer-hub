
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Moon, 
  Sun, 
  RefreshCw, 
  Layout, 
  PinIcon,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';

interface DashboardCustomizationProps {
  onClose: () => void;
  isPinned: boolean;
  onPinToggle: () => void;
}

const DashboardCustomization: React.FC<DashboardCustomizationProps> = ({
  onClose,
  isPinned,
  onPinToggle
}) => {
  const { theme, setTheme } = useTheme();
  const [autoRefresh, setAutoRefresh] = useState<boolean>(() => {
    const saved = localStorage.getItem('dashboard-auto-refresh');
    return saved ? JSON.parse(saved) : false;
  });
  const [layoutMode, setLayoutMode] = useState<string>(() => {
    const saved = localStorage.getItem('dashboard-layout-mode');
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('dashboard-auto-refresh', JSON.stringify(autoRefresh));
  }, [autoRefresh]);

  useEffect(() => {
    localStorage.setItem('dashboard-layout-mode', layoutMode);
  }, [layoutMode]);

  return (
    <Card className="dashboard-customization w-full md:w-80 absolute right-0 top-0 bottom-0 z-30 rounded-none md:rounded-l-lg border-l shadow-xl animate-slide-in-right">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold text-primary text-lg">Personalización</h3>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onPinToggle}
                  className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-primary transition-colors",
                    isPinned && "text-primary"
                  )}
                >
                  <PinIcon className={cn("h-4 w-4", isPinned && "fill-primary")} />
                  <span className="sr-only">
                    {isPinned ? "Desanclar panel" : "Anclar panel"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isPinned ? "Desanclar panel" : "Anclar panel"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-64px)]">
        <CardContent className="p-4 space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wide">Apariencia</h4>
            
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">Tema</span>
              <div className="flex gap-2">
                <Button 
                  variant={theme === 'light' ? "default" : "outline"} 
                  size="sm" 
                  className="flex-1 gap-1"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </Button>
                <Button 
                  variant={theme === 'dark' ? "default" : "outline"} 
                  size="sm" 
                  className="flex-1 gap-1"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                  Oscuro
                </Button>
                <Button 
                  variant={theme === 'system' ? "default" : "outline"} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setTheme('system')}
                >
                  Sistema
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wide">Dashboard</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto-refrescar datos</Label>
                <div className="text-sm text-muted-foreground">Actualizar cada 5 minutos</div>
              </div>
              <Switch 
                id="auto-refresh" 
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Diseño</Label>
              <ToggleGroup type="single" value={layoutMode} onValueChange={(value) => value && setLayoutMode(value)}>
                <ToggleGroupItem value="compact" className="flex-1">Compacto</ToggleGroupItem>
                <ToggleGroupItem value="default" className="flex-1">Normal</ToggleGroupItem>
                <ToggleGroupItem value="expanded" className="flex-1">Expandido</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wide">Funciones</h4>
            
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualizar datos ahora
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <Layout className="h-4 w-4" />
              Restablecer diseño
            </Button>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default DashboardCustomization;
