
import React from 'react';
import { MobileNavigation } from './MobileNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OfflineStatus } from '@/components/ui/offline-status';
import { MobileHeader } from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppSidebar } from './AppSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavigation = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <div className="flex w-full bg-background">
        {!isMobile && <AppSidebar />}
        
        <div className="flex flex-col flex-grow min-h-screen w-full relative">
          {isMobile && <MobileHeader />}
          
          <main className="flex-grow overflow-auto pb-16">
            <div className="container mx-auto pt-2 pb-8 px-2 animate-fade-in">
              <OfflineStatus className="mb-4" />
              {children}
            </div>
          </main>
          
          {!hideNavigation && isMobile && (
            <div className="sticky bottom-0 left-0 right-0 z-40">
              <MobileNavigation />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
