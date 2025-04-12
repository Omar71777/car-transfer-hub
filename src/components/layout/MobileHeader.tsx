
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, Search, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';

interface MobileHeaderProps {
  title?: string;
  backButton?: boolean;
  actions?: React.ReactNode;
  transparent?: boolean;
}

export function MobileHeader({ 
  title, 
  backButton = false, 
  actions,
  transparent = false
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { openMobile, setOpenMobile } = useSidebar();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleOpenSidebar = () => {
    setOpenMobile(true);
  };
  
  // Get page title from location if not provided
  const pageTitle = title || getPageTitleFromLocation(location.pathname);
  
  return (
    <div className={`sticky top-0 z-40 w-full border-b border-border/40 ${transparent ? 'bg-transparent' : 'bg-background/80 backdrop-blur-sm'}`}>
      <div className="container flex h-14 items-center justify-between px-2">
        <div className="flex items-center">
          {backButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="mr-2 touch-manipulation"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenSidebar}
              className="mr-2 touch-manipulation"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          {actions}
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Notifications"
            className="touch-manipulation"
          >
            <BellRing className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get page title from location
function getPageTitleFromLocation(pathname: string): string {
  if (pathname === '/') return 'Inicio';
  if (pathname.startsWith('/transfers')) return 'Traslados';
  if (pathname.startsWith('/billing')) return 'Facturas';
  if (pathname.startsWith('/clients')) return 'Clientes';
  if (pathname.startsWith('/profile')) return 'Perfil';
  if (pathname.startsWith('/collaborators')) return 'Colaboradores';
  if (pathname.startsWith('/expenses')) return 'Gastos';
  if (pathname.startsWith('/profits')) return 'Beneficios';
  return 'Car Transfer Hub';
}
