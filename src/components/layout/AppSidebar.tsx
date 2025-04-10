
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BadgeEuro, BarChart3, Building2, Calendar, FileSpreadsheet, Files, Home, LogOut, Settings, TruckIcon, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sidebar, 
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';

export const AppSidebar = () => {
  const location = useLocation();
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile, setOpenMobile } = useSidebar();

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
    <Sidebar>
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
                <SidebarMenuButton onClick={signOut}>
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
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
        )}
      </SidebarMenu>
    </Sidebar>
  );
};
