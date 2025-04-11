
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function SidebarSection({
  children,
  title,
  className,
}: SidebarSectionProps) {
  return (
    <div className={cn("py-2", className)}>
      {title && (
        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className="space-y-1 px-1">
        {children}
      </div>
      <Separator className="bg-white/10 my-2" />
    </div>
  );
}
