
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
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative overflow-hidden',
          isActive
            ? 'bg-aqua-light/40 text-electric font-medium shadow-sm' 
            : 'text-sidebar-foreground/80 hover:bg-aqua-light/20 hover:text-electric'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-electric rounded-r" />}
          <Icon className={cn("h-4 w-4", isActive ? "text-electric" : "text-electric/70")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
