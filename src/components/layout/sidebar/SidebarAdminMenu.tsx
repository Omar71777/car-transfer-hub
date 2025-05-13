
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
import { cn } from '@/lib/utils';

export const SidebarAdminMenu: React.FC = () => {
  const location = useLocation();

  // Helper to determine if a path is active
  const isActive = (path: string) => location.pathname.includes(path);

  // Get class names for menu buttons based on active state
  const getMenuButtonClass = (path: string) => {
    return cn(
      "transition-colors duration-200",
      isActive(path) 
        ? "text-sidebar-selected font-medium bg-sidebar-selected/10 shadow-sm" 
        : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground"
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/70">ADMINISTRACIÓN</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={getMenuButtonClass('/admin/users')}
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
