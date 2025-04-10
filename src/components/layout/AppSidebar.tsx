
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BadgeEuro, BarChart3, Building2, Calendar, FileSpreadsheet, Files, Home, LogOut, Settings, TruckIcon, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sidebar, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarSub } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();

  // Get the initials of the user's name
  const getInitials = () => {
    if (!profile) return 'U';
    
    const firstInitial = profile.first_name?.charAt(0) || '';
    const lastInitial = profile.last_name?.charAt(0) || '';
    
    return firstInitial + lastInitial || profile.email?.charAt(0).toUpperCase() || 'U';
  };

  // Full name display
  const fullName = () => {
    if (!profile) return 'Usuario';
    
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    
    return profile.email || 'Usuario';
  };

  return (
    <Sidebar open={isOpen} onClose={onClose} className="top-0">
      <div className="pb-4">
        <div className="px-4 py-6 flex items-center">
          <Avatar className="h-9 w-9 mr-2">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center overflow-hidden">
            <p className="text-sm font-medium truncate">
              {fullName()}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email || 'usuario@ejemplo.com'}
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <SidebarMenu>
        <SidebarMenuItem
          icon={<Home size={20} />}
          className={location.pathname === '/' ? 'text-primary' : undefined}
          href="/"
          as={Link}
        >
          Inicio
        </SidebarMenuItem>

        <SidebarMenuItem
          icon={<TruckIcon size={20} />}
          className={location.pathname.includes('/transfers') ? 'text-primary' : undefined}
          href="/transfers"
          as={Link}
        >
          Transfers
        </SidebarMenuItem>

        <SidebarMenuItem
          icon={<Files size={20} />}
          className={location.pathname.includes('/expenses') ? 'text-primary' : undefined}
          href="/expenses"
          as={Link}
        >
          Gastos
        </SidebarMenuItem>

        <SidebarMenuItem
          icon={<BadgeEuro size={20} />}
          className={location.pathname.includes('/profits') ? 'text-primary' : undefined}
          href="/profits"
          as={Link}
        >
          Ganancias
        </SidebarMenuItem>

        <SidebarMenuItem
          icon={<Calendar size={20} />}
          className={location.pathname.includes('/shifts') ? 'text-primary' : undefined}
          href="/shifts"
          as={Link}
        >
          Turnos
        </SidebarMenuItem>

        <SidebarMenuItem
          icon={<Building2 size={20} />}
          className={location.pathname.includes('/collaborators') ? 'text-primary' : undefined}
          href="/collaborators"
          as={Link}
        >
          Colaboradores
        </SidebarMenuItem>

        <SidebarGroup title="MI CUENTA" collapsible>
          <SidebarMenuItem
            icon={<Settings size={20} />}
            className={location.pathname.includes('/profile') ? 'text-primary' : undefined}
            href="/profile"
            as={Link}
          >
            Mi Perfil
          </SidebarMenuItem>
          
          <SidebarMenuItem
            icon={<LogOut size={20} />}
            onClick={signOut}
          >
            Cerrar Sesión
          </SidebarMenuItem>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup title="ADMINISTRACIÓN" collapsible>
            <SidebarMenuItem
              icon={<Users size={20} />}
              className={location.pathname.includes('/admin/users') ? 'text-primary' : undefined}
              href="/admin/users"
              as={Link}
            >
              Usuarios
            </SidebarMenuItem>
            
            <SidebarSub title="Reportes">
              <SidebarMenuItem
                icon={<FileSpreadsheet size={20} />}
                href="/admin/reports/transfers"
                as={Link}
              >
                Transfers
              </SidebarMenuItem>
              <SidebarMenuItem
                icon={<BarChart3 size={20} />}
                href="/admin/reports/analytics"
                as={Link}
              >
                Análisis
              </SidebarMenuItem>
            </SidebarSub>
          </SidebarGroup>
        )}
      </SidebarMenu>
    </Sidebar>
  );
};
