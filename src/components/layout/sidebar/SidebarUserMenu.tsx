
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Helper to determine if a path is active
  const isActive = (path: string) => location.pathname.includes(path);

  // Get class names for menu buttons based on active state
  const getMenuButtonClass = (path: string) => {
    return cn(
      "transition-colors duration-200",
      isActive(path) 
        ? "text-sidebar-primary font-medium bg-sidebar-selected shadow-sm" 
        : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground"
    );
  };

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      // Call the provided signOut function
      await onSignOut();
      
      // Force navigation to auth page in case the signOut function doesn't redirect
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, try to force a redirect anyway
      window.location.href = '/auth';
    }
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
              onClick={handleSignOut}
              className="text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-colors duration-200"
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
