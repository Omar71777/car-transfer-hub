
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CreditCard, Home, PlusCircle, DollarSign, BarChart2, UserCheck } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const AppSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: PlusCircle, label: 'Nuevo Transfer', path: '/transfers/new' },
    { icon: Calendar, label: 'Transfers', path: '/transfers' },
    { icon: CreditCard, label: 'Gastos', path: '/expenses' },
    { icon: BarChart2, label: 'Ganancias', path: '/profits' },
    { icon: UserCheck, label: 'Turnos', path: '/shifts' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Ibiza Transfer Hub</span>
          <SidebarTrigger className="ml-auto lg:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-accent-foreground/80">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={cn(
                    location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : "")
                  }>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-6 py-4">
          <p className="text-xs text-white/60">Ibiza Transfer Hub © 2025</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
