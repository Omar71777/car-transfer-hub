
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
import { cn } from '@/lib/utils';

interface SidebarUserMenuProps {
  onSignOut: () => void;
}

export const SidebarUserMenu: React.FC<SidebarUserMenuProps> = ({ onSignOut }) => {
  const location = useLocation();

  // Helper to determine if a path is active
  const isActive = (path: string) => location.pathname.includes(path);

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
    <SidebarGroup>
      <SidebarGroupLabel>MI CUENTA</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={getMenuButtonClass('/profile')}
              asChild
            >
              <Link to="/profile">
                <Settings size={20} />
                <span>Mi Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onSignOut}
              className="hover:bg-[hsl(var(--sidebar-hover))] transition-colors duration-200"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
