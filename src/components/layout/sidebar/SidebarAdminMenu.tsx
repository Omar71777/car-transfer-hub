
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
        ? "text-white font-medium bg-white/20 shadow-sm" 
        : "text-white/80 hover:bg-white/10 hover:text-white"
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/80">ADMINISTRACIÓN</SidebarGroupLabel>
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
