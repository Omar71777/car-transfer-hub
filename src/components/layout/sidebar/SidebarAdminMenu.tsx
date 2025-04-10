
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileSpreadsheet, Users } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';

export const SidebarAdminMenu: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>ADMINISTRACIÓN</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={location.pathname.includes('/admin/users') ? 'text-primary' : undefined}
              asChild
            >
              <Link to="/admin/users">
                <Users size={20} />
                <span>Usuarios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
