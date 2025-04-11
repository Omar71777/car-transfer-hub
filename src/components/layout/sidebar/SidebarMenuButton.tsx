
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarMenuButtonProps {
  label: string;
  icon: LucideIcon;
  url: string;
  end?: boolean;
}

export function SidebarMenuButton({ label, icon: Icon, url, end }: SidebarMenuButtonProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={url}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative overflow-hidden',
              isActive
                ? 'bg-aqua-light/40 text-white font-medium shadow-sm' 
                : 'text-white/80 hover:bg-aqua-light/20 hover:text-white',
              isCollapsed && 'justify-center px-2'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-aqua rounded-r" />}
              <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-white/80")} />
              {!isCollapsed && <span>{label}</span>}
            </>
          )}
        </NavLink>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
