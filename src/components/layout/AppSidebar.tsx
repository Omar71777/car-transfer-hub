
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';
import { useSidebar } from '@/components/ui/sidebar/sidebar-provider';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { SidebarMainMenu } from './sidebar/SidebarMainMenu';
import { SidebarUserMenu } from './sidebar/SidebarUserMenu';
import { SidebarAdminMenu } from './sidebar/SidebarAdminMenu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuth();
  const { openMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar className={cn(
      "border-r border-sidebar-border bg-sidebar",
      isMobile ? "text-white" : ""
    )} data-mobile={isMobile}>
      <div className="py-6 px-3">
        <SidebarUserProfile profile={profile} />
        <Separator className="bg-sidebar-border my-4" />
      </div>

      <SidebarMainMenu />
      <SidebarUserMenu onSignOut={signOut} />
      
      {isAdmin && <SidebarAdminMenu />}
      
      <SidebarFooter className="mt-auto border-t border-sidebar-border py-4">
        <div className={cn(
          "px-4 py-2 text-xs text-sidebar-foreground/70",
          isMobile ? "text-white" : ""
        )}>
          CTHub © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
