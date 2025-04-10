
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
