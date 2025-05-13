
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarMenuButtonProps {
  label: string;
  icon: LucideIcon;
  url: string;
  end?: boolean;
}

export const SidebarMenuButton = ({ label, icon: Icon, url, end = false }: SidebarMenuButtonProps) => {
  return (
    <NavLink 
      to={url} 
      end={end}
      className={({ isActive }) => cn(
        "sidebar-menu-button flex items-center w-full",
        isActive && "active"
      )}
      onClick={(e) => {
        // Stop propagation to prevent parent containers from handling this click
        e.stopPropagation();
      }}
    >
      <Icon className="h-4 w-4 mr-3 text-sidebar-foreground/80" />
      <span className="text-sidebar-foreground">{label}</span>
    </NavLink>
  );
};
