
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
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
  Minimize2
} from 'lucide-react';

interface DashboardCustomizationProps {
  onToggleCompactMode: () => void;
  onRefreshData: () => void;
  isCompactMode: boolean;
}

export function DashboardCustomization({ onToggleCompactMode, onRefreshData, isCompactMode }: DashboardCustomizationProps) {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="flex flex-col items-end space-y-3">
        {expanded && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                Personalizar Dashboard
              </CardTitle>
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
                  onCheckedChange={(checked) => setAutoRefresh(checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Diseño</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-2 border rounded-md hover:bg-primary/5 flex items-center justify-center">
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 border rounded-md hover:bg-primary/5 flex items-center justify-center">
                    <PanelLeftOpen className="h-4 w-4" />
                  </button>
                  <button className="p-2 border rounded-md hover:bg-primary/5 flex items-center justify-center">
                    <PanelRight className="h-4 w-4" />
                  </button>
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
                  <Button variant="outline" size="sm" className="text-xs h-8 w-full">
                    <Pin className="h-3.5 w-3.5 mr-1" />
                    Anclar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span className="h-4 w-4 rounded-full bg-blue-500 mr-2"></span>
                Azul
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
                Púrpura
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
                Verde
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            size="sm" 
            variant={expanded ? "default" : "outline"} 
            className={`rounded-full h-10 w-10 p-0 ${expanded ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <Layout className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
