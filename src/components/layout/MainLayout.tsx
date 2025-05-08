
import React, { useEffect } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OfflineStatus } from '@/components/ui/offline-status';
import { MobileHeader } from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppSidebar } from './AppSidebar';
import { usePointerEventsFix } from '@/hooks/use-pointer-events-fix';
import { OfflineDetection } from '@/components/ui/offline-detection';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
  title?: string;
  backButton?: boolean;
  headerActions?: React.ReactNode;
  transparent?: boolean;
  fullWidth?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  hideNavigation = false,
  title,
  backButton,
  headerActions,
  transparent = false,
  fullWidth = false
}) => {
  const isMobile = useIsMobile();
  
  // Apply the pointer events fix
  usePointerEventsFix();
  
  // Ensure pointer events are always enabled when main layout renders or updates
  useEffect(() => {
    document.body.style.pointerEvents = 'auto';
    
    // If there are no open dialogs, reset overflow style
    const hasOpenDialog = document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]');
    if (!hasOpenDialog && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
    
    return () => {
      // Safety cleanup to ensure pointer events stay enabled
      document.body.style.pointerEvents = 'auto';
    };
  }, []);
  
  return (
    <TooltipProvider>
      <div className="flex w-full bg-background">
        {!isMobile && <AppSidebar />}
        
        <div className="flex flex-col flex-grow min-h-screen w-full relative" id="main-content">
          {isMobile && (
            <MobileHeader 
              title={title}
              backButton={backButton}
              actions={headerActions}
              transparent={transparent}
            />
          )}
          
          <main className="flex-grow overflow-auto pb-16 animate-fade-in">
            <div className={`mx-auto pt-2 pb-8 px-2 sm:px-4 ${fullWidth ? 'w-full' : 'container'}`}>
              <OfflineStatus className="mb-4" />
              <div className={isMobile ? 'mobile-stack space-y-4' : ''}>
                {children}
              </div>
            </div>
          </main>
          
          {!hideNavigation && isMobile && (
            <div className="sticky bottom-0 left-0 right-0 z-40">
              <MobileNavigation />
            </div>
          )}
        </div>
      </div>
      <OfflineDetection />
    </TooltipProvider>
  );
}
