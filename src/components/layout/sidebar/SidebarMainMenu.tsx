
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BadgeEuro, BarChart3, Building2, Calendar, FileSpreadsheet, Files, Home, TruckIcon } from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const SidebarMainMenu: React.FC = () => {
  const location = useLocation();

  // Helper to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.includes(path);
  };

  // Get class names for menu buttons based on active state
  const getMenuButtonClass = (path: string) => {
    return cn(
      "transition-colors duration-200",
      isActive(path) 
        ? "text-sidebar-primary font-medium bg-[hsl(var(--sidebar-selected))]" 
        : "hover:bg-[hsl(var(--sidebar-hover))]"
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/')}
          asChild
        >
          <Link to="/">
            <Home size={20} />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/transfers')}
          asChild
        >
          <Link to="/transfers">
            <TruckIcon size={20} />
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
            <Files size={20} />
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
            <BadgeEuro size={20} />
            <span>Ganancias</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/shifts')}
          asChild
        >
          <Link to="/shifts">
            <Calendar size={20} />
            <span>Turnos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          className={getMenuButtonClass('/collaborators')}
          asChild
        >
          <Link to="/collaborators">
            <Building2 size={20} />
            <span>Colaboradores</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Reports Menu - With improved visual state styling */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          className={cn(
            "transition-colors duration-200",
            isActive('/admin/reports') 
              ? "text-sidebar-primary font-medium bg-[hsl(var(--sidebar-selected))]" 
              : "hover:bg-[hsl(var(--sidebar-hover))]"
          )}
        >
          <span>Reportes</span>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton 
              className={getMenuButtonClass('/admin/reports/transfers')}
              asChild
            >
              <Link to="/admin/reports/transfers">
                <FileSpreadsheet size={20} />
                <span>Transfers</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton 
              className={getMenuButtonClass('/admin/reports/analytics')}
              asChild
            >
              <Link to="/admin/reports/analytics">
                <BarChart3 size={20} />
                <span>Análisis</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
