
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Banknote, 
  Receipt, 
  Calendar, 
  BarChart, 
  Users, 
  Home,
  CreditCard
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function SidebarMainMenu({ className, ...props }: React.ComponentProps<typeof SidebarMenu>) {
  const location = useLocation();

  // Helper to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  // Get class names for menu buttons based on active state
  const getMenuButtonClass = (path: string) => {
    return cn(
      "transition-colors duration-200",
      isActive(path) 
        ? "text-sidebar-primary font-medium bg-sidebar-selected" 
        : "hover:bg-sidebar-hover"
    );
  };

  return (
    <SidebarMenu className={className} {...props}>
      <SidebarGroupLabel>Navegación</SidebarGroupLabel>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/')}
          asChild
        >
          <Link to="/">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/transfers')}
          asChild
        >
          <Link to="/transfers">
            <Banknote className="h-5 w-5" />
            <span>Transfers</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/expenses')}
          asChild
        >
          <Link to="/expenses">
            <Receipt className="h-5 w-5" />
            <span>Gastos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/profits')}
          asChild
        >
          <Link to="/profits">
            <BarChart className="h-5 w-5" />
            <span>Beneficios</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/collaborators')}
          asChild
        >
          <Link to="/collaborators">
            <Users className="h-5 w-5" />
            <span>Colaboradores</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarGroupLabel>Informes</SidebarGroupLabel>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/reports/unpaid')}
          asChild
        >
          <Link to="/reports/unpaid">
            <CreditCard className="h-5 w-5" />
            <span>Pagos Pendientes</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/admin/reports/analytics')}
          asChild
        >
          <Link to="/admin/reports/analytics">
            <BarChart className="h-5 w-5" />
            <span>Análisis</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
