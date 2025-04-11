
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Layout, 
  Palette, 
  PanelLeftOpen, 
  ChevronRight, 
  Grid3X3,
  RefreshCw,
  Pin,
  PanelRight,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { Toggle, ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DashboardCustomizationProps {
  onToggleCompactMode: () => void;
  onRefreshData: () => void;
  isCompactMode: boolean;
}

export function DashboardCustomization({ onToggleCompactMode, onRefreshData, isCompactMode }: DashboardCustomizationProps) {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<string>('grid');
  const [themePalette, setThemePalette] = useState<string>('default');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [isPanelPinned, setIsPanelPinned] = useState(false);
  
  // Load saved settings from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedTheme = localStorage.getItem('dashboardTheme');
    const savedAutoRefresh = localStorage.getItem('dashboardAutoRefresh');
    const savedPinned = localStorage.getItem('dashboardPinned');
    
    if (savedLayout) setCurrentLayout(savedLayout);
    if (savedTheme) setThemePalette(savedTheme);
    if (savedAutoRefresh) setAutoRefresh(savedAutoRefresh === 'true');
    if (savedPinned) setIsPanelPinned(savedPinned === 'true');
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardLayout', currentLayout);
    localStorage.setItem('dashboardTheme', themePalette);
    localStorage.setItem('dashboardAutoRefresh', String(autoRefresh));
    localStorage.setItem('dashboardPinned', String(isPanelPinned));
  }, [currentLayout, themePalette, autoRefresh, isPanelPinned]);
  
  // Handle auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = window.setInterval(() => {
        onRefreshData();
        toast.info("Datos actualizados automáticamente", {
          duration: 2000,
          position: "bottom-right"
        });
      }, 30000); // 30 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, onRefreshData, refreshInterval]);
  
  const handleThemeChange = (theme: string) => {
    setThemePalette(theme);
    
    // Apply theme classes to body or root element
    const root = document.documentElement;
    
    // Remove all existing theme classes
    root.classList.remove('theme-blue', 'theme-purple', 'theme-green');
    
    // Add the selected theme class
    if (theme !== 'default') {
      root.classList.add(`theme-${theme}`);
    }
    
    toast.success(`Tema cambiado a ${theme}`, { 
      duration: 2000,
      position: "bottom-right"
    });
  };
  
  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout);
    
    // Apply layout changes by dispatching a custom event that the dashboard can listen to
    window.dispatchEvent(new CustomEvent('dashboard-layout-change', { 
      detail: { layout } 
    }));
    
    toast.success(`Diseño cambiado a ${layout}`, {
      duration: 2000,
      position: "bottom-right"
    });
  };
  
  const togglePinPanel = () => {
    setIsPanelPinned(!isPanelPinned);
    
    toast.success(!isPanelPinned ? "Panel anclado" : "Panel desanclado", {
      duration: 2000,
      position: "bottom-right"
    });
  };
  
  const handleAutoRefreshToggle = (checked: boolean) => {
    setAutoRefresh(checked);
    
    if (checked) {
      toast.success("Auto-actualización activada", {
        duration: 2000,
        position: "bottom-right"
      });
    }
  };
  
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };
  
  return (
    <div className={`fixed ${isPanelPinned ? 'right-4 top-20' : 'right-4 bottom-4'} z-50`}>
      <div className="flex flex-col items-end space-y-3">
        <Collapsible 
          open={expanded} 
          onOpenChange={setExpanded}
          className="w-full"
        >
          <CollapsibleContent forceMount className="overflow-hidden">
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-lg border-primary/20 bg-card/95 backdrop-blur-md w-72">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <Layout className="h-4 w-4 mr-2 text-primary" />
                    Personalizar Dashboard
                  </CardTitle>
                  {expanded && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cerrar</span>
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-mode" className="flex items-center text-sm cursor-pointer">
                      {isCompactMode ? (
                        <Maximize2 className="h-3.5 w-3.5 mr-2" />
                      ) : (
                        <Minimize2 className="h-3.5 w-3.5 mr-2" />
                      )}
                      <span>{isCompactMode ? "Modo Expandido" : "Modo Compacto"}</span>
                    </Label>
                    <Switch 
                      id="compact-mode" 
                      checked={isCompactMode}
                      onCheckedChange={onToggleCompactMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh" className="flex items-center text-sm cursor-pointer">
                      <RefreshCw className="h-3.5 w-3.5 mr-2" />
                      <span>Auto-Actualizar</span>
                    </Label>
                    <Switch 
                      id="auto-refresh" 
                      checked={autoRefresh}
                      onCheckedChange={handleAutoRefreshToggle}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Tema</Label>
                    <ToggleGroup type="single" value={themePalette} onValueChange={(value) => value && handleThemeChange(value)}>
                      <ToggleGroupItem value="default" className="flex items-center justify-center" aria-label="Tema Default">
                        <span className="h-4 w-4 rounded-full bg-primary mr-1"></span>
                        <span className="text-xs">Default</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="blue" className="flex items-center justify-center" aria-label="Tema Azul">
                        <span className="h-4 w-4 rounded-full bg-blue-500 mr-1"></span>
                        <span className="text-xs">Azul</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="purple" className="flex items-center justify-center" aria-label="Tema Púrpura">
                        <span className="h-4 w-4 rounded-full bg-purple-500 mr-1"></span>
                        <span className="text-xs">Púrpura</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="green" className="flex items-center justify-center" aria-label="Tema Verde">
                        <span className="h-4 w-4 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs">Verde</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Diseño</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={currentLayout === 'grid' ? "default" : "outline"} 
                        size="sm" 
                        className="p-2 h-9 flex items-center justify-center"
                        onClick={() => handleLayoutChange('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={currentLayout === 'left' ? "default" : "outline"} 
                        size="sm" 
                        className="p-2 h-9 flex items-center justify-center"
                        onClick={() => handleLayoutChange('left')}
                      >
                        <PanelLeftOpen className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={currentLayout === 'right' ? "default" : "outline"} 
                        size="sm" 
                        className="p-2 h-9 flex items-center justify-center"
                        onClick={() => handleLayoutChange('right')}
                      >
                        <PanelRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Acciones</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 w-full" 
                        onClick={onRefreshData}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Actualizar
                      </Button>
                      <Button 
                        variant={isPanelPinned ? "default" : "outline"} 
                        size="sm" 
                        className="text-xs h-8 w-full"
                        onClick={togglePinPanel}
                      >
                        <Pin className="h-3.5 w-3.5 mr-1" />
                        {isPanelPinned ? 'Desanclar' : 'Anclar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </CollapsibleContent>
          
          <div className="flex gap-2 mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full h-10 w-10 p-0 bg-card/95 backdrop-blur-sm shadow-md border-primary/20 hover:bg-primary/10"
                >
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-primary/20 bg-card/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={() => handleThemeChange('default')}>
                  <span className="h-4 w-4 rounded-full bg-primary mr-2"></span>
                  Tema Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('blue')}>
                  <span className="h-4 w-4 rounded-full bg-blue-500 mr-2"></span>
                  Tema Azul
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('purple')}>
                  <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
                  Tema Púrpura
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('green')}>
                  <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
                  Tema Verde
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <CollapsibleTrigger asChild>
              <Button 
                size="sm" 
                variant={expanded ? "default" : "outline"} 
                className={`rounded-full h-10 w-10 p-0 ${expanded ? 'bg-primary text-primary-foreground' : 'bg-card/95 backdrop-blur-sm border-primary/20 hover:bg-primary/10'} shadow-md`}
              >
                {expanded ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <Layout className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
