
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Bus, FileText, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center justify-around bg-background/90 border-t border-border/40 shadow-lg backdrop-blur-md py-2">
        <NavItem 
          to="/" 
          icon={<Home size={20} />} 
          label="Inicio" 
          isActive={currentPath === '/'} 
        />
        <NavItem 
          to="/transfers" 
          icon={<Bus size={20} />} 
          label="Traslados" 
          isActive={currentPath.startsWith('/transfers')} 
        />
        <NavItem 
          to="/billing" 
          icon={<FileText size={20} />} 
          label="Facturas" 
          isActive={currentPath.startsWith('/billing')} 
        />
        <NavItem 
          to="/clients" 
          icon={<User size={20} />} 
          label="Clientes" 
          isActive={currentPath.startsWith('/clients')} 
        />
        <NavItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          label="Ajustes" 
          isActive={currentPath.startsWith('/settings') || currentPath.startsWith('/profile')} 
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center px-3 py-1 rounded-lg touch-manipulation",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground active:text-foreground active:bg-accent/30"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full mb-0.5",
        isActive && "bg-primary/10"
      )}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
