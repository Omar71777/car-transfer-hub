
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

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      // Call the provided signOut function
      await onSignOut();
      
      // Navigate to landing page instead of auth page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, try to force a redirect anyway
      window.location.href = '/';
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/80">MI CUENTA</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
              asChild
              isActive={isActive('/profile')}
            >
              <Link to="/profile">
                <Settings className="h-4 w-4 mr-3 text-white/80" />
                <span className="text-white">Mi Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-3 text-white/80" />
              <span className="text-white">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
