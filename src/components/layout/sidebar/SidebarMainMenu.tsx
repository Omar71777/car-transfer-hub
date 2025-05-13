
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  CalendarClock, 
  Car,
  Building2,
  FileSpreadsheet, 
  Users, 
  BadgeDollarSign
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';
import { SidebarMenuButton } from './SidebarMenuButton';

export const SidebarMainMenu = () => {
  const { isAdmin, isCompanyMember } = useAuth();
  
  return (
    <SidebarMenu>
      <h3 className="text-xs uppercase font-medium mb-2 px-4 text-sidebar-foreground/70">Principal</h3>
      
      <SidebarMenuItem>
        <SidebarMenuButton label="Inicio" icon={Home} url="/" end={true} />
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton label="Transfers" icon={CalendarClock} url="/transfers" />
      </SidebarMenuItem>
      
      {isCompanyMember && (
        <>
          <SidebarMenuItem>
            <SidebarMenuButton label="Vehículos" icon={Car} url="/vehicles" />
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton label="Empresas" icon={Building2} url="/companies" />
          </SidebarMenuItem>
        </>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton label="Facturación" icon={FileSpreadsheet} url="/billing" />
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton label="Clientes" icon={Users} url="/clients" />
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton label="Rentabilidad" icon={BadgeDollarSign} url="/profits" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
