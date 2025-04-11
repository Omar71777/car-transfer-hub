import React from 'react';
import { Link } from 'react-router-dom'; // Using react-router-dom instead of next/link
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  className?: string;
}

export function SidebarItem({
  title,
  href,
  icon,
  className,
}: SidebarItemProps) {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-white/5",
          className
        )}
      >
        {icon}
        {title}
      </Link>
    </li>
  );
}

