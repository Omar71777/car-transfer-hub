
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto max-w-full">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};
