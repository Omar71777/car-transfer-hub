
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative overflow-hidden group',
          isActive
            ? 'bg-sidebar-selected text-white font-medium shadow-sm' 
            : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-white'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-1EAEDB rounded-r"
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            />
          )}
          <Icon 
            className={cn(
              "h-4 w-4", 
              isActive 
                ? "text-white" 
                : "text-sidebar-foreground/70 group-hover:text-white"
            )} 
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
