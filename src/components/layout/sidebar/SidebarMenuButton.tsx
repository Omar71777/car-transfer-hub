
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuButtonProps {
  label: string;
  icon: LucideIcon;
  url: string;
  end?: boolean;
}

export function SidebarMenuButton({ label, icon: Icon, url, end }: SidebarMenuButtonProps) {
  return (
    <NavLink
      to={url}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-sidebar-selected text-sidebar-foreground font-medium shadow-sm'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground'
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
