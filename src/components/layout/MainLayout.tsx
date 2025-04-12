
import React from 'react';
import { MobileNavigation } from './MobileNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineStatus } from '@/components/ui/offline-status';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <main className="flex-1 p-0 w-full h-screen overflow-auto pb-20">
          <div className="container mx-auto pt-4 pb-20 px-3 animate-fade-in">
            <OfflineStatus className="mb-4" />
            {children}
          </div>
          <MobileNavigation />
        </main>
      </div>
    </TooltipProvider>
  );
};
