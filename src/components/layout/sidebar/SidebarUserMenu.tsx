
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
} from '@/components/ui/sidebar';

interface SidebarUserMenuProps {
  onSignOut: () => void;
}

export const SidebarUserMenu: React.FC<SidebarUserMenuProps> = ({ onSignOut }) => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MI CUENTA</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={location.pathname.includes('/profile') ? 'text-primary' : undefined}
              asChild
            >
              <Link to="/profile">
                <Settings size={20} />
                <span>Mi Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
