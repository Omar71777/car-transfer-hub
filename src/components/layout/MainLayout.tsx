
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';

// Sidebar toggle for mobile
const MobileSidebarToggle = () => {
  const { openMobile, setOpenMobile } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => setOpenMobile(!openMobile)}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Abrir menú</span>
    </Button>
  );
};

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto max-w-full">
            <MobileSidebarToggle />
            <div className="container mx-auto max-w-7xl pt-8 md:pt-0">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};
