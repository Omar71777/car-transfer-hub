
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

export const SidebarMainMenu: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={location.pathname === '/' ? 'text-primary' : undefined}
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
          className={location.pathname.includes('/transfers') ? 'text-primary' : undefined}
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
          className={location.pathname.includes('/expenses') ? 'text-primary' : undefined}
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
          className={location.pathname.includes('/profits') ? 'text-primary' : undefined}
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
          className={location.pathname.includes('/shifts') ? 'text-primary' : undefined}
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
          className={location.pathname.includes('/collaborators') ? 'text-primary' : undefined}
          asChild
        >
          <Link to="/collaborators">
            <Building2 size={20} />
            <span>Colaboradores</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Reports Menu - Moved from Admin menu */}
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span>Reportes</span>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <Link to="/admin/reports/transfers">
                <FileSpreadsheet size={20} />
                <span>Transfers</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
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
