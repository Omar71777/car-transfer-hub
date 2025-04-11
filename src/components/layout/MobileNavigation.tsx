
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, BarChart2, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function MobileNavigation() {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  
  const handleMenuClick = () => {
    setOpenMobile(true);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-30 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md border-t border-border/30 shadow-lg">
      <div className="flex items-center justify-around h-16">
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center justify-center rounded-full h-12 w-12"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-0.5">Inicio</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center justify-center rounded-full h-12 w-12"
          onClick={() => navigate('/transfers')}
        >
          <CreditCard className="h-5 w-5" />
          <span className="text-xs mt-0.5">Transfers</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center justify-center rounded-full h-12 w-12"
          onClick={() => navigate('/profits')}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs mt-0.5">Beneficios</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center justify-center rounded-full h-12 w-12"
          onClick={() => navigate('/profile')}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-0.5">Perfil</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="flex flex-col items-center justify-center rounded-full h-12 w-12"
          onClick={handleMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-0.5">Menú</span>
        </Button>
      </div>
    </div>
  );
}
