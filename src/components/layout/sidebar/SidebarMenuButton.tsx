
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
            ? 'bg-secondary/30 text-white font-medium shadow-sm' 
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-secondary rounded-r" />}
          <Icon className={cn("h-4 w-4", isActive ? "text-secondary" : "text-secondary/70")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
