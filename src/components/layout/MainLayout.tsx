
import React from 'react';
import { MobileNavigation } from './MobileNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineStatus } from '@/components/ui/offline-status';
import { MobileHeader } from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavigation = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <main className="flex-1 p-0 w-full h-screen overflow-auto pb-20">
          <div className="container mx-auto pt-2 pb-20 px-2 animate-fade-in">
            <OfflineStatus className="mb-4" />
            {children}
          </div>
          {!hideNavigation && isMobile && <MobileNavigation />}
        </main>
      </div>
    </TooltipProvider>
  );
}
