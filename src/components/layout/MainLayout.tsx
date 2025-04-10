
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Sidebar toggle for mobile
const MobileSidebarToggle = () => {
  const { openMobile, setOpenMobile } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden fixed top-2 left-2 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => setOpenMobile(!openMobile)}
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-0 md:p-4 lg:p-6 overflow-auto max-w-full">
            <MobileSidebarToggle />
            <div className="container mx-auto max-w-7xl pt-8 px-2 md:pt-0 md:px-4">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};
