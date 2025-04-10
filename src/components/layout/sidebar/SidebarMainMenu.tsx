
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Banknote, 
  Receipt, 
  Calendar, 
  BarChart, 
  Users, 
  Home,
  FileText,
  CreditCard
} from 'lucide-react';
import { SidebarMenuProps } from '@/components/ui/sidebar/sidebar-menu';
import { SidebarMenu, SidebarMenuHeader } from '@/components/ui/sidebar';

export function SidebarMainMenu(props: SidebarMenuProps) {
  const location = useLocation();

  return (
    <SidebarMenu {...props}>
      <SidebarMenuHeader>Navegación</SidebarMenuHeader>
      
      <Link 
        to="/"
        className={`sidebar-menu-item ${location.pathname === '/' && 'active'}`}
      >
        <Home className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      
      <Link
        to="/transfers"
        className={`sidebar-menu-item ${location.pathname.includes('/transfers') && 'active'}`}
      >
        <Banknote className="h-5 w-5" />
        <span>Transfers</span>
      </Link>
      
      <Link
        to="/expenses"
        className={`sidebar-menu-item ${location.pathname.includes('/expenses') && 'active'}`}
      >
        <Receipt className="h-5 w-5" />
        <span>Gastos</span>
      </Link>
      
      <Link
        to="/profits"
        className={`sidebar-menu-item ${location.pathname.includes('/profits') && 'active'}`}
      >
        <BarChart className="h-5 w-5" />
        <span>Beneficios</span>
      </Link>
      
      <Link
        to="/collaborators"
        className={`sidebar-menu-item ${location.pathname.includes('/collaborators') && 'active'}`}
      >
        <Users className="h-5 w-5" />
        <span>Colaboradores</span>
      </Link>
      
      <SidebarMenuHeader>Informes</SidebarMenuHeader>
      
      <Link
        to="/admin/reports/transfers"
        className={`sidebar-menu-item ${location.pathname.includes('/admin/reports/transfers') && 'active'}`}
      >
        <FileText className="h-5 w-5" />
        <span>Informe Transfers</span>
      </Link>
      
      <Link
        to="/reports/unpaid"
        className={`sidebar-menu-item ${location.pathname.includes('/reports/unpaid') && 'active'}`}
      >
        <CreditCard className="h-5 w-5" />
        <span>Pagos Pendientes</span>
      </Link>
      
      <Link
        to="/admin/reports/analytics"
        className={`sidebar-menu-item ${location.pathname.includes('/admin/reports/analytics') && 'active'}`}
      >
        <BarChart className="h-5 w-5" />
        <span>Análisis</span>
      </Link>
    </SidebarMenu>
  );
}
