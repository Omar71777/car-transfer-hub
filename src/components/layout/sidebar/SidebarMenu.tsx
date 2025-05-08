import React from 'react';
interface SidebarMenuProps {
  title: string;
  children: React.ReactNode;
}
export function SidebarMenu({
  title,
  children
}: SidebarMenuProps) {
  return <div className="sidebar-menu">
      <h3 className="sidebar-menu-title text-xs uppercase font-medium mb-2 px-4 text-aqua-light">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>;
}