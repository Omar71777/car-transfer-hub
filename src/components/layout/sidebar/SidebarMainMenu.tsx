import React from 'react';
import { SidebarMenu } from './SidebarMenu';
import { SidebarMenuButton } from './SidebarMenuButton';
import {
  LayoutDashboard,
  Bus,
  Receipt,
  Users,
  BarChart3,
  UserRound,
  FileText,
} from 'lucide-react';

export const SidebarMainMenu = () => {
  return (
    <SidebarMenu title="General">
      <SidebarMenuButton label="Dashboard" icon={LayoutDashboard} url="/" end />
      <SidebarMenuButton label="Transfers" icon={Bus} url="/transfers" />
      <SidebarMenuButton label="Gastos" icon={Receipt} url="/expenses" />
      <SidebarMenuButton label="Colaboradores" icon={Users} url="/collaborators" />
      <SidebarMenuButton label="Clientes" icon={UserRound} url="/clients" />
      <SidebarMenuButton label="Facturación" icon={FileText} url="/billing" />
      <SidebarMenuButton label="Informes" icon={BarChart3} url="/profits" />
    </SidebarMenu>
  );
};

export const SidebarAdminMenu = () => {
  return (
    <SidebarMenu title="Admin">
      <SidebarMenuButton label="Usuarios" icon={Users} url="/admin/users" />
      <SidebarMenuButton label="Informes" icon={BarChart3} url="/admin/reports/analytics" />
    </SidebarMenu>
  );
};
