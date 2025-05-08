
import React from 'react';
import { 
  Home, 
  CalendarClock, 
  Car,
  Building2,
  FileSpreadsheet, 
  Users, 
  BadgeDollarSign,
  ChevronRight
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';

export const SidebarMainMenu = () => {
  const { isAdmin, isCompanyMember } = useAuth();
  
  return (
    <SidebarMenu>
      <SidebarMenuHeader>Principal</SidebarMenuHeader>
      
      <SidebarMenuItem href="/" icon={<Home />}>
        Inicio
      </SidebarMenuItem>
      
      <SidebarMenuItem href="/transfers" icon={<CalendarClock />}>
        Transfers
        <ChevronRight className="ml-auto h-4 w-4" />
      </SidebarMenuItem>
      
      {isCompanyMember && (
        <>
          <SidebarMenuItem href="/vehicles" icon={<Car />}>
            Vehículos
            <ChevronRight className="ml-auto h-4 w-4" />
          </SidebarMenuItem>
          
          <SidebarMenuItem href="/companies" icon={<Building2 />}>
            Empresas
            <ChevronRight className="ml-auto h-4 w-4" />
          </SidebarMenuItem>
        </>
      )}
      
      <SidebarMenuItem href="/billing" icon={<FileSpreadsheet />}>
        Facturación
        <ChevronRight className="ml-auto h-4 w-4" />
      </SidebarMenuItem>
      
      <SidebarMenuItem href="/clients" icon={<Users />}>
        Clientes
        <ChevronRight className="ml-auto h-4 w-4" />
      </SidebarMenuItem>
      
      <SidebarMenuItem href="/profits" icon={<BadgeDollarSign />}>
        Rentabilidad
        <ChevronRight className="ml-auto h-4 w-4" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
